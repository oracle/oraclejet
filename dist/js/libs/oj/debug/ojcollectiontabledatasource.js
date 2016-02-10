/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojdatasource-common', 'ojs/ojmodel'], function(oj, $)
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
 * @class oj.CollectionTableDataSource
 * @extends oj.TableDataSource
 * @classdesc Object representing data used by table component
 * @param {oj.Collection} data data supported by the components
 * @param {Object|null} options Array of options for the TableDataSource
 * @constructor
 */
oj.CollectionTableDataSource = function(data, options)
{
  // Initialize
  this.data = {};   // This was put in to keep closure happy...
  if (!(data instanceof oj.Collection))
  {
    // we only support oj.Collection
    var errSummary = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_SUMMARY'];
    var errDetail = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_DETAIL'];
    throw new Error(errSummary + '\n' + errDetail);
  }
  
  oj.CollectionTableDataSource.superclass.constructor.call(this, data, options);

  this._collection = data;
  this._addCollectionEventListeners();
  
  this.Init();

  if ((options != null && (options['startFetch'] == 'enabled' || options['startFetch'] == null))
    || options == null)
  {
    this._startFetchEnabled = true;
  }
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.CollectionTableDataSource, oj.TableDataSource, "oj.CollectionTableDataSource");

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.Init = function()
{
  oj.CollectionTableDataSource.superclass.Init.call(this);
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
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.at = function(index, options)
{
  options = options || {};
  options['deferred'] = true;
  var model = this._collection.at(index, options);
  var self = this;
  // the at() call can result in fetches
  self._isFetchingForAt = true;
  var row;
  return new Promise(function(resolve, reject) 
  {
    if (model != null)
    {
      model.then(function(resolvedModel)
      {
        self._isFetchingForAt = false;
        row = {'data': resolvedModel['attributes'], 'index': index, 'key': resolvedModel['id']};
        resolve(row);
      },
      function(e)
      {
        self._isFetchingForAt = false;
        oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['ERROR'], e);
        reject(e);
      });
    }
    else
    {
      resolve(null);
    }
  });
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
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.fetch = function(options)
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
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.get = function(id, options)
{
  options = options || {};
  options['deferred'] = true;
  var model = this._collection.get(id, options);
  
  var self = this;
  var row;
  return new Promise(function(resolve, reject) 
  {
    if (model != null)
    {
      model.then(function(resolvedModel)
      {
        row = {'data': resolvedModel['attributes'], 'index': resolvedModel['index'], 'key': resolvedModel['id']};
        resolve(row);
      },
      function(e)
      {
        oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['ERROR'], e);
        reject(e);
      });
    }
    else
    {
      resolve(null);
    }
  });
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.sort = function(criteria)
{   
  if (criteria == null)
  {
    return Promise.resolve();
  }
  
  var self = this;
  return new Promise(function(resolve, reject) {
    self._setComparator(criteria);
    self._collection.sort(null);
    var result = {'header': criteria['key'], 'direction': criteria['direction']};
    resolve(result);
  });    
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.totalSize = function()
{
  var totalSize = this._collection['totalResults'] >= 0 ? this._collection['totalResults'] : -1;
  
  if (totalSize > -1)
  {
    var size = this._collection.size();
    return size > totalSize ? size : totalSize;
  }
  else
  {
    if (this._fetchResultSize > 0)
    {
      totalSize = this._fetchResultSize;
    }
    else if (this.totalSizeConfidence() == "atLeast")
    {
      return this._collection.size();
    }
  }
  
  return totalSize;
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
oj.CollectionTableDataSource.prototype.totalSizeConfidence = function()
{ 
  if (this._collection['totalResults'] >= 0)
  {
    return "actual";
  }
  else if (this._collection['hasMore'])
  {
    // if totalResults is unknown but we know we have more then
    // we know we have at least a certain number of rows
    return "atLeast";
  }
  return "unknown";
};

/**
 * Add event listeners to the collection
 * @private
 */
oj.CollectionTableDataSource.prototype._addCollectionEventListeners = function()
{
  var self = this;
  this._collection.on(oj.Events.EventType['SYNC'], function(event) 
  {
    if (!(event instanceof oj.Collection))
    {
      return;
    }
    if (!self._isFetchingForAt && !self._isFetching)
    {
      var startIndex = event['offset'];
      var pageSize = event['lastFetchCount'];

      if (pageSize > 0)
      {
        self._startIndex = startIndex;
        self._pageSize = pageSize;
        
        // paged fetch
        self._isFetchingForAt = true;
        event.IterativeAt(startIndex, startIndex + pageSize).then(function(modelArray)
        {
          self._isFetchingForAt = false;
          var rowArray = [];
          var keyArray = [];
          var i;
          for (i = 0; i < modelArray.length; i++)
          {
            if (modelArray[i] != null)
            {
              rowArray.push(modelArray[i]['attributes']);
              keyArray.push(modelArray[i]['id']);
            }
          }
          var result = {'data': rowArray, 'keys': keyArray, 'startIndex': startIndex};
          self._endFetch.call(self, {'silent': false}, result, null);
        });
      }
      else
      {
        var result = self._getRowArray();
        self._endFetch.call(self, {'silent': false}, result, null);
      }
    }
  });
  this._collection.on(oj.Events.EventType['ALLADDED'], function(event, modelArray) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    var i;
    for (i = 0; i < modelArray.length; i++)
    {
      rowArray.push(modelArray[i]['attributes']);
      keyArray.push(modelArray[i]['id']);
      indexArray.push(modelArray[i]['index']);
    }
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['ADD'], {'data': rowArray, 'keys': keyArray, 'indexes': indexArray});
  });
  this._collection.on(oj.Events.EventType['ALLREMOVED'], function(event, modelArray) {
    var rowArray = [];
    var keyArray = [];
    var indexArray = [];
    var i;
    for (i = 0; i < modelArray.length; i++)
    {
      rowArray.push(modelArray[i]['attributes']);
      keyArray.push(modelArray[i]['id']);
      indexArray.push(modelArray[i]['index']);
    }
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['REMOVE'], {'data': rowArray, 'keys': keyArray, 'indexes': indexArray});
  });
  this._collection.on(oj.Events.EventType['RESET'], function(event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['RESET'], event);
  });
  this._collection.on(oj.Events.EventType['SORT'], function(event, eventOpts) {
    if (eventOpts == null || !eventOpts['add'])
    {
      oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['SORT'], event);
    }
  });
  this._collection.on(oj.Events.EventType['CHANGE'], function(event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['CHANGE'], {'data': [event['attributes']], 'keys': [event['id']], 'indexes': [event['index']]});
  });
  this._collection.on(oj.Events.EventType['DESTROY'], function(event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['DESTROY'], event);
  });
  this._collection.on(oj.Events.EventType['REFRESH'], function(event) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['REFRESH'], event);
  });
  this._collection.on(oj.Events.EventType['ERROR'], function(collection, xhr, options) {
    oj.TableDataSource.superclass.handleEvent.call(self, oj.TableDataSource.EventType['ERROR'], collection, xhr, options);
  });
};

oj.CollectionTableDataSource.prototype._fetchInternal = function(options)
{
  this._startFetch(options);
  options = options || {};
  var self = this;
  this._isPaged =  options['pageSize'] > 0 ? true : false;
  this._startIndex = options['startIndex'] == null ? this._startIndex : options['startIndex'];
  this._pageSize = options['pageSize'] > 0 ? options['pageSize'] : -1;
  options['pageSize'] = this._pageSize;
  options['startIndex'] = this._startIndex;
  options['refresh'] = true;

  return new Promise(function (resolve, reject)
  {
    var pageSize = self._pageSize;
    
    if (!self._isPaged)
    {
      // set an arbitrary page size for setRangeLocal. When non-virtual, will fetch everything anyway.
      pageSize = 25;
    }
    
    self._collection.setRangeLocal(self._startIndex, pageSize).then(function(actual) 
      {
        var result;
        
        if (self._isPaged)
        {
          var rowArray = [];
          var keyArray = [];
          var i;
          for (i = 0; i < actual['models'].length; i++)
          {
            rowArray[i] = actual['models'][i]['attributes'];
            keyArray[i] = actual['models'][i]['id'];
          }
          result = {'data': rowArray, 'keys': keyArray, 'startIndex': self._startIndex};
          
          if (actual['models'].length < self._pageSize)
          {
            // it returned less than a page of data so we're at the end
            // set the totalSize if unknown
            if (self.totalSize() < 0)
            {
              self._fetchResultSize = self._startIndex + actual['models'].length;
            }
          }
          else
          {
            self._fetchResultSize = null;
          }
        }
        else
        {
          result = self._getRowArray();
        }

        self._endFetch.call(self, options, result, null);
        resolve(result);
      },
      function(error) 
      {
        self._endFetch.call(self, options, null, error);
        reject(error);
      });
  });
};

/**
 * Indicate starting fetch
 * @param {Object} options
 * @private
 */
oj.CollectionTableDataSource.prototype._startFetch = function(options)
{
  this._isFetching = true;
  if (!options['silent'])
  {
    oj.TableDataSource.superclass.handleEvent.call(this, oj.TableDataSource.EventType['REQUEST'], {'startIndex' : options['startIndex']});
  }
};

/**
 * Indicate ending fetch
 * @param {Object} options
 * @param {Object} result Result object
 * @param {*} error Error
 * @private
 */
oj.CollectionTableDataSource.prototype._endFetch = function(options, result, error)
{
  this._isFetching = false;
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

oj.CollectionTableDataSource.prototype._setComparator = function(criteria) {
  
  if (criteria == null)
  {
    this._collection['comparator'] = null;
    return;
  }
  
  var key = criteria['key']; 
  var direction = criteria['direction'];
  var comparator = null;
  
  if (this._collection.IsVirtual()) {
      // Only strings are supported for virtual sorts
      this._collection['comparator'] = key;
      this._collection['sortDirection'] = direction === 'ascending' ? 1 : -1;
      return;
  }
  
  if (direction == 'ascending')
  {
    comparator = function(row) {
      if ($.isFunction(row.get))
      {
        return row.get(key);
      }
      else
      {
        return row[key]();
      }
    };
  }
  else if (direction == 'descending')
  {
    comparator = function(rowA, rowB) {
      var a, b;
      if ($.isFunction(rowA.get))
      {
        a = rowA.get(key);
        b = rowB.get(key);
      }
      else
      {
        a = rowA[key]();
        b = rowB[key]();
      }
      if (a === b)
      {
        return 0;
      }
      return a > b ? -1 : 1;
    };
  }
  this._collection['comparator'] = comparator;
};

oj.CollectionTableDataSource.prototype._getRowArray = function()
{
  var endIndex = this._collection.size() - 1;
  var rowArray = [];
  var keyArray = [];
  var i;
  for (i = 0; i <= endIndex; i++)
  {
    rowArray[i] = this._collection.at(i)['attributes'];
    keyArray[i] = this._collection.at(i)['id'];
  }
  return {'data': rowArray, 'keys': keyArray, 'startIndex': this._startIndex};
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.CollectionTableDataSource
 * @instance
 */
oj.CollectionTableDataSource.prototype.getCapability = function(feature)
{
    return null;
};

});
