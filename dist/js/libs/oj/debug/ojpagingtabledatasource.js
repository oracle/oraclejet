/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
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
 * @class oj.PagingTableDataSource
 * @classdesc Object representing data used by the paging component
 * @extends oj.TableDataSource
 * @implements oj.PagingModel
 * @param {Object} dataSource
 * @param {Object|null} options Array of options for the PagingControlDataSource
 * @constructor
 */
oj.PagingTableDataSource = function(dataSource, options)
{
  // Initialize
  options = options || {};
  
  if (!(dataSource instanceof oj.TableDataSource))
  {
    // we only support Array, oj.Collection, or ko.observableArray. To
    // check for observableArray, we can't do instanceof check because it's
    // a function. So we just check if it contains a subscribe function.
    var errSummary = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_SUMMARY'];
    var errDetail = oj.TableDataSource._LOGGER_MSG['_ERR_DATA_INVALID_TYPE_DETAIL'];
    throw new Error(errSummary + '\n' + errDetail);
  }
  this.dataSource = dataSource;
  this._startIndex = 0;
  this._endIndex = -1;
  this.Init();
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.PagingTableDataSource, oj.TableDataSource, "oj.PagingTableDataSource");

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.Init = function()
{
  oj.PagingTableDataSource.superclass.Init.call(this);
};

/**
 * Retrieves the underlying DataSource.
 * @return {Object} the underlying oj.DataSource.
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getWrappedDataSource = function()
{
    return this.dataSource;
};

/**
 * Get the current page
 * @return {number} The current page
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getPage = function()
{
  if (this._fetchType == 'loadMore')
  {
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
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.setPage = function(value, options)
{
  options = options || {};
  value = parseInt(value, 10);
  
  try 
  {
    oj.PagingTableDataSource.superclass.handleEvent.call(this, oj.PagingModel.EventType['BEFOREPAGE'], {'page' : value, 'previousPage' : this._getPageFromStartIndex()});
  }
  catch (err)
  {
    return Promise.reject(null);
  }
  var previousPage = this._getPageFromStartIndex();
  this._pageSize = options['pageSize'] != null ? options['pageSize'] : this._pageSize;
  options['pageSize'] = this._pageSize;
  options['startIndex'] = value * this._pageSize;
  this._startIndex = options['startIndex'] == null ? this._startIndex : options['startIndex'];
  this._fetchType = 'page';
  var self = this;
  return new Promise(function(resolve, reject) 
  {
    // we only support paged fetches
    if (self._pageSize > 0)
    {
      self.dataSource.fetch(options).then(function(result)
      {
        result['startIndex'] = 0;
        self._updateEndIndex(result['data'].length);
        oj.PagingTableDataSource.superclass.handleEvent.call(self, oj.PagingModel.EventType['PAGE'], {'page' : self._getPageFromStartIndex(), 'previousPage' : previousPage});
        resolve(null);
      },
      function(e)
      {
        self._startIndex = previousPage * self._pageSize;
        reject(null); 
      });
    }
    else
    {
      resolve(null);
    }
  });
};

/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getStartItemIndex = function()
{
  if (this._fetchType == 'loadMore')
  {
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
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getEndItemIndex = function()
{
  return this._endIndex;
};

/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getPageCount = function()
{
  var totalSize = this.totalSize();
  return totalSize == -1 ? -1 : Math.ceil(totalSize / this._pageSize);
};

/**** start delegated functions ****/

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
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.at = function(index, options)
{
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
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.fetch = function(options)
{
  options = options || {};
  if (options['startIndex'] == null)
  {
    // this is just a refresh call from ojTable. So treat it as a paged fetch
    return this.setPage(this.getPage());
  }
  else
  {
    this._fetchType = 'loadMore';
  }
  this._startIndex = options['startIndex'] == null ? this._startIndex : options['startIndex'];
  var pageSize = options['pageSize'] != null ? options['pageSize'] : this._pageSize;
  options['pageSize'] = pageSize;
  options['startIndex'] = this._startIndex;
  
  var self = this;
  return new Promise(function(resolve, reject) 
  {
    // we only support paged fetches
    if (pageSize > 0)
    {
      self.dataSource.fetch(options).then(function(result)
      {
        self._updateEndIndex(result['data'].length);
        resolve(result);
      },
      function(e)
      {
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
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.get = function(id, options)
{
  return this.dataSource.get(id, options);
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.getCapability = function(feature)
{
  return this.dataSource.getCapability(feature);
};

/**
 * Attach an event handler to the datasource
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @return {function(Object)} the event handler function attached to the event 
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.on = function(eventType, eventHandler)
{
  var self = this;
  var dataSource = (/** @type {{on: Function}} */ (this.dataSource));
  
  if (eventType == oj.TableDataSource.EventType['SYNC'])
  {
    var ev = function(event){self._handleSyncEvent(event, eventHandler);}
    dataSource.on(eventType, ev);
    return ev;
  }
  else if (eventType == oj.TableDataSource.EventType['ADD'] ||
           eventType == oj.TableDataSource.EventType['REMOVE'] ||
           eventType == oj.TableDataSource.EventType['CHANGE'])
  {
    var ev = function(event){self._handleRowEvent(event, eventHandler);}
    dataSource.on(eventType, ev);
    return ev;
  }
  else if (eventType == oj.TableDataSource.EventType['REFRESH'] ||
           eventType == oj.TableDataSource.EventType['RESET'])
  {
    var ev = function(event){
      self._startIndex = 0;
      eventHandler(event);
    }
    dataSource.on(eventType, ev);
    return ev;
  }
  else if (eventType == oj.PagingModel.EventType['PAGE'] ||
           eventType == oj.PagingModel.EventType['PAGECOUNT'])
  {
    oj.PagingTableDataSource.superclass.on.call(this, eventType, eventHandler);
    return eventHandler;
  }
  else
  {
    dataSource.on(eventType, eventHandler);
    return eventHandler;
  }
};

/**
 * Detach an event handler from the datasource
 * @param {string} eventType eventType supported by the datasource
 * @param {function(Object)} eventHandler event handler function
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.off = function(eventType, eventHandler)
{
  if (eventType == oj.PagingModel.EventType['PAGE'] ||
      eventType == oj.PagingModel.EventType['PAGECOUNT'])
  {
    oj.PagingTableDataSource.superclass.off.call(this, eventType, eventHandler);
    return eventHandler;
  }
  var dataSource = (/** @type {{off: Function}} */ (this.dataSource));
  return dataSource.off(eventType, eventHandler);
};

/**
 * Performs a sort on the data source.
 * @param {Object} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.sort = function(criteria)
{
  return this.dataSource.sort(criteria);
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance
 */
oj.PagingTableDataSource.prototype.totalSize = function()
{
  return this.dataSource.totalSize();
};

/**
 * Returns the confidence for the totalSize value. 
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number 
 *                  "estimate" if the totalSize is an estimate 
 *                  "atLeast" if the totalSize is at least a certain number 
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof! oj.PagingTableDataSource
 * @instance 
 */
oj.PagingTableDataSource.prototype.totalSizeConfidence = function()
{ 
  return this.dataSource.totalSizeConfidence();
};

/**** end delegated functions ****/

oj.PagingTableDataSource.prototype._getPageFromStartIndex = function()
{
  if (this._pageSize > 0)
  {
    return Math.floor(this._startIndex / this._pageSize);
  }
  return 0;
}

oj.PagingTableDataSource.prototype._handleRowEvent = function(event, eventHandler)
{
  var ignoreRows = [];
  var i;
  for (i = 0; i < event['indexes'].length; i++)
  {
    var rowIdx = event['indexes'][i];
    if (rowIdx !== undefined) 
    {
      // adjust by startIndex
      rowIdx = rowIdx - this._startIndex;
      
      if (rowIdx < 0 || rowIdx >= this._startIndex + this._pageSize)
      {
        // ignore if it's not in our page range
        ignoreRows.push(i);
      }
    }
  }
  
  if (ignoreRows.length > 0)
  {
    ignoreRows.sort(function(a, b) 
    { 
      return a - b;
    });
    
    for (i = ignoreRows.length - 1; i >= 0; i--)
    {
      event['data'].splice(ignoreRows[i], 1);
      event['indexes'].splice(ignoreRows[i], 1);
      event['keys'].splice(ignoreRows[i], 1);
    }
  }
  
  this._updateEndIndex(event['data'].length);
  
  event['startIndex'] = this._startIndex;
  eventHandler(event);
};

oj.PagingTableDataSource.prototype._handleSyncEvent = function(event, eventHandler)
{
  var eventStartIndex = event['startIndex'];
  
  if (eventStartIndex != this._startIndex)
  {
    this._startIndex = event['startIndex'];
  }
  this._updateEndIndex(event['data'].length);
  
  if (this._fetchType == 'page')
  {
    // For paged fetches, reset the startIndex to zero since we always render
    // starting at 0
    var clonedEvent = {};
    oj.CollectionUtils.copyInto(clonedEvent, event);
    clonedEvent['startIndex'] = 0;
    eventHandler(clonedEvent);
  }
  else
  {
    eventHandler(event);
  }
};

oj.PagingTableDataSource.prototype._updateEndIndex = function(resultSize)
{
  var totalSize = this.totalSize();
  
  if (totalSize > 0)
  {
    this._endIndex = this._startIndex + this._pageSize - 1;
    this._endIndex = this._endIndex > totalSize - 1 ? totalSize - 1 : this._endIndex;
  }
  else
  {
    // if we have unknown total size then use the resultSize to constrain the end index
    // if resultSize < pageSize then we have less than a full page of results
    if (resultSize > 0)
    {
      this._endIndex = this._startIndex + resultSize - 1;
    }
    else
    {
      // we don't have any records in the fetch so the indexes should be -1;   
      this._endIndex = -1;
    }
  }
};

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.PagingTableDataSource.EventType =
  {
    /** Triggered when a Row is added to a PagingDataSource */
    'ADD': "add",
    /** Triggered when a Row is removed from a PagingDataSource */
    'REMOVE': "remove",
    /** Triggered when a PagingDataSource is reset */
    'RESET': "reset",
    /** Triggered when a PagingDataSource has been updated by a fetch */
    'SYNC': "sync",
    /** Triggered when a PagingDataSource has been refreshed */
    'REFRESH': "refresh",
    /** Triggered when a PagingDataSource has been sorted */
    'SORT': "sort"
  };
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
 * The interface for oj.PagingModel which should be implemented by all object instances
 * bound to the data parameter for oj.PagingControl. oj.PagingModel implementations should
 * also support event subscription by extending oj.EventSource or oj.DataSource.
 * @export
 * @interface
 */
oj.PagingModel = function()
{
};

/**
 * Get the current page
 * @return {number} The current page
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.getPage = function()
{
};

/**
 * Set the current page
 * @param {number} value The current page
 * @param {Object=} options Options<p>
 *                  pageSize: The page size.<p>
 * @return {Promise} promise object triggering done when complete..
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.setPage = function(value, options)
{
};

/**
 * Get the current page start index
 * @return {number} The current page start index
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.getStartItemIndex = function()
{
};

/**
 * Get the current page end index
 * @return {number} The current page end index
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.getEndItemIndex = function()
{
};

/**
 * Get the page count
 * @return {number} The total number of pages
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.getPageCount = function()
{
};

/**
 * @export
 * Return the total number of items. Returns -1 if unknown.
 * @returns {number} total number of items
 * @expose
 * @memberof! oj.PagingModel
 * @instance
 */
oj.PagingModel.prototype.totalSize = function()
{
};

/**
 * Returns the confidence for the totalSize value. 
 * @return {string} "actual" if the totalSize is the time of the fetch is an exact number 
 *                  "estimate" if the totalSize is an estimate 
 *                  "atLeast" if the totalSize is at least a certain number 
 *                  "unknown" if the totalSize is unknown
 * @export
 * @expose
 * @memberof! oj.PagingModel
 * @instance 
 */
oj.PagingModel.prototype.totalSizeConfidence = function()
{ 
};

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.PagingModel.EventType =
  {
    /** Triggered before the current page has changed. <p>
     * This event is vetoable.<p>
     * The event payload contains:<p>
     * <b>page</b> The new current page
     * <b>previousPage</b> The old current page
     */
    'BEFOREPAGE': "beforePage",
    /** Triggered when the current page has changed<p>
     * The event payload contains:<p>
     * <b>page</b> The new current page
     * <b>previousPage</b> The old current page
     */
    'PAGE': "page",
    /** Triggered when the page count has changed<p>
     * The event payload contains:<p>
     * <b>pageCount</b> The new page count
     * <b>previousPageCount</b> The old page count
     */
    'PAGECOUNT': "pageCount"
  };


});
