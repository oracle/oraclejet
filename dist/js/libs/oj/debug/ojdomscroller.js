/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery'], function(oj, $)
{
/*jslint browser: true*/
/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/

/**
 * @ignore
 * @class oj.DomScroller
 * @classdesc Adds implicit highwatermark scrolling to DOM element
 * @param {Object} element Scrollable DOM element
 * @param {Object} datasource Instance of the TableDataSource
 * @param {Object=} options Options for the DomScroller<p>
 *                  <b>success</b>: a user callback called when a fetch has completed successfully after scroll to bottom. Also called with maxCount information if maxCount is reached after scroll to bottom.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called with the failed fetch content.<br>
 *                  <b>fetchSize</b>: the fetch size. Default is 25.<br>
 *                  <b>maxCount</b>: max row count. DomScroller will not exceed this max count. Default is 500.<br>
 * @constructor
 */
oj.DomScroller = function(element, datasource, options)
{
  options = options || {};
  this._data = datasource;
  this._element = element;
  this._fetchSize = options['fetchSize'];
  this._fetchSize = this._fetchSize > 0 ? this._fetchSize : 25;
  this._maxCount = options['maxCount'];
  this._maxCount = this._maxCount > 0 ? this._maxCount : 500;
  this._rowCount = 0;
  this._successCallback = options['success'];
  this._errorCallback = options['error'];
  this._registerDataSourceEventListeners();
  
  $(this._element).on('scroll.domscroller', function(event) {
    var scrollTop = $(event.target).scrollTop();
    var maxScrollTop = $(event.target)[0].scrollHeight - $(event.target)[0].clientHeight;

    if (maxScrollTop > 0)
    {
      this._handleScrollerScrollTop(scrollTop, maxScrollTop);
    }
  }.bind(this));
};

/**
 * Destroys the dom scroller, unregister any event handlers.
 * @export
 * @expose
 * @memberof! oj.DomScroller
 * @instance
 */ 
oj.DomScroller.prototype.destroy = function()
{
  this._unregisterDataSourceEventListeners();
  $(this._element).off('scroll.domscroller');
};

/**
 * Check the viewport to see if a fetch needs to be done to fill it. Fetch if it does.
 * @return {Promise} Return a Promise which contains either the content of the fetch
 *                   or maxCount information if it has reached maxCount. Promise resolves to null if no fetch was done.
 * @throws {Error}
 * @export
 * @expose
 * @memberof! oj.DomScroller
 * @instance
 */
oj.DomScroller.prototype.checkViewport = function()
{
  if (this._element[0].clientHeight > 0 && 
      !this._checkOverflow())
  {
    return this._fetchMoreRows();
  }
  return Promise.resolve(null);
};

/**
 * Handle scrollTop on scroller
 * @private	
 */
oj.DomScroller.prototype._handleScrollerScrollTop = function(scrollTop, maxScrollTop)
{
  if (maxScrollTop - scrollTop <= 1)
  {
    var self = this;
    this._fetchMoreRows().then(function(result) 
    {
      if (self._successCallback != null )
      {
        self._successCallback(result);
      }
    }, this._errorCallback);
  }
};

/**
 * Check whether the scroll DOM has overflowed
 * @private	
 */
oj.DomScroller.prototype._checkOverflow = function()
{
  var element = this._element;
  
  if (element[0].scrollHeight > element[0].clientHeight + 1)
  {
    return true;
  }
  return false;
};

/**
 * Try to fetch more rows
 * @private	
 */
oj.DomScroller.prototype._fetchMoreRows = function()
{
  if (!this._fetchPromise)
  {
    // make sure we don't exceed maxCount
    var remainingCount = this._maxCount - this._rowCount;
    if (remainingCount > 0)
    {
      var pageSize = this._fetchSize;
      var self = this;
      if (remainingCount < this._fetchSize)
      {
        pageSize = remainingCount;
      }
      var fetchPromise = this._fetchNext({'pageSize': pageSize});

      this._fetchPromise = new Promise(function(resolve, reject)
      {
        fetchPromise.then(function(result)
        {
          self._fetchPromise = null;
          
          if (result != null)
          {
            self._rowCount = result['data'].length + result['startIndex'];
            
            if (remainingCount < self._fetchSize)
            {
              result['maxCount'] = self._maxCount;
              result['maxCountLimit'] = true;
            }
          }
          resolve(result);
        });
      });
      
      return this._fetchPromise;
    }
     // we need to indicate that we've hit maxCount
    return Promise.resolve({'maxCount': this._maxCount, 'maxCountLimit': true});
  }
  else
  {
    return this._fetchPromise;
  }
};

oj.DomScroller.prototype._fetchNext = function(options)
{ 
  options = options || {};
  var pageSize = options['pageSize'];
  
  if (!this._currentStartIndex)
  {
    this._currentStartIndex = pageSize;
  }
  else
  {
    this._currentStartIndex = this._currentStartIndex + pageSize;
  }
    
  if (this._data.totalSize() == -1 || this._data.totalSize() > this._currentStartIndex)
  {
    var self = this;
    return new Promise(function(resolve, reject)
    {
      self._data.fetch({'startIndex': self._currentStartIndex, 'pageSize': pageSize}).then(function(result)
      {
        resolve(result);
      }, function (error)
      {
        reject(null);  
      });
    });
  }
  return Promise.resolve();
};

oj.DomScroller.prototype._handleDataReset = function()
{
  this._currentStartIndex = null;
  this._rowCount = 0;
}

oj.DomScroller.prototype._handleDataSync = function(event)
{
  this._currentStartIndex = event['startIndex'];
  this._rowCount = event['data'].length + this._currentStartIndex;
}

/**
 * Register event listeners which need to be registered datasource. 
 * @private
 */
oj.DomScroller.prototype._registerDataSourceEventListeners = function()
{
  // register the listeners on the datasource
  var data = this._data;
  if (data != null)
  {
    this._unregisterDataSourceEventListeners();

    this._dataSourceEventHandlers = [];
    this._dataSourceEventHandlers.push({'eventType': oj.TableDataSource.EventType['SORT'], 'eventHandler': this._handleDataReset.bind(this)});
    this._dataSourceEventHandlers.push({'eventType': oj.TableDataSource.EventType['REFRESH'], 'eventHandler': this._handleDataReset.bind(this)});
    this._dataSourceEventHandlers.push({'eventType': oj.TableDataSource.EventType['RESET'], 'eventHandler': this._handleDataReset.bind(this)});
    this._dataSourceEventHandlers.push({'eventType': oj.TableDataSource.EventType['SYNC'], 'eventHandler': this._handleDataSync.bind(this)});

    var i;
    var ev;
    for (i = 0; i < this._dataSourceEventHandlers.length; i++) {
      ev = data.on(this._dataSourceEventHandlers[i]['eventType'], this._dataSourceEventHandlers[i]['eventHandler']);
      if (ev) {
          this._dataSourceEventHandlers[i]['eventHandler'] = ev;
      }
    }
  }
};

/**
 * Unregister event listeners which are registered on datasource. 
 * @private
 */
oj.DomScroller.prototype._unregisterDataSourceEventListeners = function()
{
  var data = this._data;
  // unregister the listeners on the datasource
  if (this._dataSourceEventHandlers != null && data != null)
  {
    var i;
    for (i = 0; i < this._dataSourceEventHandlers.length; i++)
      data.off(this._dataSourceEventHandlers[i]['eventType'], this._dataSourceEventHandlers[i]['eventHandler']);
  }
};


});
