/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery', 'ojs/ojarraytabledatasource'], function(oj, $)
{
/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true,devel:true*/
/**
 * @ignore
 * @export
 * @interface
 * @memberof oj
 */
oj.ProgressItem = function() {
};

/**
 * Attach an event handler
 *
 * @method
 * @name addEventListener
 * @memberof! oj.ProgressItem
 * @instance
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 *
 * @export
 */

/**
 * Detach an event handler
 *
 * @method
 * @name removeEventListener
 * @memberof! oj.ProgressItem
 * @instance
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 *
 * @export
 */

/**
 * @export
 * Status
 * @enum {string}
 */
oj.ProgressItem.Status = {
  /**
   * initial state before any progress events
   */
  'QUEUED': 'queued',
  /**
   * upload is in progress
   */
  'LOADSTARTED': 'loadstarted',
  /**
   * upload aborted
   */
  'ABORTED': 'aborted',
  /**
   * upload failed
   */
  'ERRORED': 'errored',
  /**
   * upload timeout
   */
  'TIMEDOUT': 'timedout',
  /**
   * upload is completed
   */
  'LOADED': 'loaded'
};

/**
 * @export
 * Event types
 * @enum {string}
 */
oj.ProgressItem.EventType = {
  /**
   * Triggered when the progress start
   */
  'LOADSTART': 'loadstart',
  /**
   * Triggered for upload progress events.
   */
  'PROGRESS': 'progress',
  /**
   * Triggered when an upload has been aborted.
   */
  'ABORT': 'abort',
  /**
   * Triggered when an upload failed.
   */
  'ERROR': 'error',
  /**
   * Triggered when an upload succeeded.
   */
  'LOAD': 'load',
  /**
   * Triggered when timeout has passed before upload completed
   */
  'TIMEOUT': 'timeout',
  /**
   * Triggered when an upload completed (success or failure).
   */
  'LOADEND': 'loadend'
};

/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true,devel:true*/
/**
 * @ignore
 * @export
 * @class 
 * @extends oj.TableDataSource
 * @classdesc Object representing data used by upload progress and progress list.
 * @param {Array|Object|function():Array} data data rows must be ProgressItem
 * @param {Object|null} options Array of options for the TableDataSource
 * @constructor
 * @since 4.0.0
 */
oj.ProgressListDataSource = function(data, options)
{
  // Initialize
  this._dataSource = new oj.ArrayTableDataSource(data, options);
  oj.ProgressListDataSource.superclass.constructor.call(this, data, options);
};

// Subclass from oj.DataSource 
oj.Object.createSubclass(oj.ProgressListDataSource, oj.TableDataSource, "oj.ProgressListDataSource");

/**
 * @export
 * @desc The sort criteria. Whenever sort() is called with the criteria parameter, that value is copied to this
 * property. If sort() is called with empty sort criteria then the criteria set in this property is used.
 * 
 * @type {Object} criteria the sort criteria.
 * @property {Object} criteria.key The key that identifies which field to sort
 * @property {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 */
oj.ProgressListDataSource.prototype.sortCriteria = null;

/**
 * Initializes the instance.
 * @export
 * @expose
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.Init = function()
{
  this._dataSource.Init();
  oj.ProgressListDataSource.superclass.Init.call(this);

  this._resetProgress();
  this._progressHandler = this._handleUploadProgress.bind(this);
  this._errorHandler = this._handleUploadFail.bind(this);
  this._doneHandler = this._handleUploadDone.bind(this);

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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.add = function(m, options)
{
  var self = this;
  var promise = this._dataSource.add(m, options);
  promise.then(function (result) {
    self._addItems(m, options);
  });
  return promise;
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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.at = function(index, options)
{
  return this._dataSource.at(index, options);
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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.fetch = function(options)
{
  return this._dataSource.fetch(options);
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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.get = function(id, options)
{
  return this._dataSource.get(id, options);
};

/**
 * Determines whether this TableDataSource supports certain feature.
 * @param {string} feature the feature in which its capabilities is inquired.  Currently the only valid feature is "sort".
 * @return {string|null} the name of the feature.  For "sort", the valid return values are: "full", "none".  
 *         Returns null if the feature is not recognized.
 * @export
 * @expose
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.getCapability = function(feature)
{
  return this._dataSource.getCapability(feature);
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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.remove = function(m, options)
{
  var self = this;
  var promise = this._dataSource.remove(m, options);
  promise.then(function (result) {
    self._removeItems(m, options);
  });
  return promise;
};

/**
 * Performs a sort on the data source.
 * @param {Object|null} criteria the sort criteria.
 * @param {Object} criteria.key The key that identifies which field to sort
 * @param {string} criteria.direction the sort direction, valid values are "ascending", "descending", "none" (default)
 * @return {Promise} promise object triggering done when complete.
 * @export
 * @expose
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.sort = function(criteria)
{
  this._dataSource['sortCriteria'] = this['sortCriteria'];
  var ret = this._dataSource.sort(criteria);
  this['sortCriteria'] = this._dataSource['sortCriteria'];
  return ret;
};

/**
 * Return the total size of data available, including server side if not local.
 * @returns {number} total size of data
 * @export
 * @expose
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.totalSize = function()
{
  return this._dataSource.totalSize();
};


/**
 * Attach an event handler
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 * @export
 */
oj.ProgressListDataSource.prototype.on = function(eventType, eventHandler)
{
  this._dataSource.on(eventType, eventHandler);
};

/**
 * Detach an event handler
 * @param {string} eventType eventType
 * @param {function(Object)} eventHandler event handler function
 * @export
 */
oj.ProgressListDataSource.prototype.off = function(eventType, eventHandler)
{
  this._dataSource.off(eventType, eventHandler);
};

/**
 * Handle the event
 * @param {string} eventType  event type
 * @param {Object} event  event
 * @return {boolean} Returns false if event is cancelled
 * @export
 */
oj.ProgressListDataSource.prototype.handleEvent = function(eventType, event)
{
  return this._dataSource.handleEvent(eventType, event);
};


/**
 * Remove the data rows having the ProgressItem status specified, If not specified remove all data rows.
 * @param {Array} statusList array of oj.ProgressItem.Status.
 * @return {Promise|IThenable} Promise object resolves to a compound object which contains an array of row data objects, an array of keys, and an array of indexes which were removed triggering done when complete.<p>
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
 * @memberof! oj.ProgressListDataSource
 * @instance
 */
oj.ProgressListDataSource.prototype.clear = function(statusList)
{
  //remove all data rows
  if (! statusList || statusList.length == 0) {
    return this._dataSource.reset(null, {silent: true});
  }

  var self = this;
  var statuses = {};

  for (var i = 0; i < statusList.length; i++) {
    statuses[statusList[i]] = true;
  }

  return this._dataSource.fetch({silent: true}).then(function (model) {
    var data = model.data;
    var progressItem;
    var m = [];

    for (var i = 0; i < data.length; i++)
    {
      progressItem = data[i];
      if (statuses[progressItem.status])
        m.push(progressItem);
    }

    return self.remove(m);
  });
};

oj.ProgressListDataSource.prototype._addItems = function(m, options)
{
  var i, progressItem;
  if (!(m instanceof Array))
    m = [m];

  for (i = 0; i < m.length; i++)
  {
    progressItem = m[i];
    if (progressItem)
    {
      //add loadstart, progress, load and error listeners
      this._addListeners(progressItem);      
    }
  }
  this._updateOverallLoaded(null);
};

oj.ProgressListDataSource.prototype._removeItems = function(m, options)
{
  var i, progressItem;
  if (!(m instanceof Array))
    m = [m];

  for (i = 0; i < m.length; i++)
  {
    progressItem = m[i];
    if (progressItem)
    {
      this._removeListeners(progressItem);
    }
  }
  this._updateOverallLoaded(null);
};


// Triggered for upload progress events
oj.ProgressListDataSource.prototype._handleUploadProgress = function(event)
{
  var progressItem = event.target;

  if (progressItem && event.lengthComputable) {
    this._updateOverallLoaded(progressItem);
  }
};

// Triggered when the upload is successfully completed.
oj.ProgressListDataSource.prototype._handleUploadDone = function(event)
{
  var progressItem = event.target;
/*
  if (progressItem && event.lengthComputable) {
    this._updateOverallLoaded(progressItem);
  }
*/
  if (this._totalUploaded >= this._totalFileLength)
    this._resetProgress();
};

// Triggered when the upload fails (error, timeout or aborted). The event payload contains:
// error: {object} {statusCode, statusText}
oj.ProgressListDataSource.prototype._handleUploadFail = function(event)
{
  var progressItem = event.target;
  if (progressItem) {
    //update progress all
    this._updateOverallLoaded(progressItem);
    this._errors++;
  }
};

oj.ProgressListDataSource.prototype._addListeners = function(progressItem)
{
  progressItem.addEventListener(oj.ProgressItem.EventType['PROGRESS'], this._progressHandler, false);
  progressItem.addEventListener(oj.ProgressItem.EventType['ERROR'], this._errorHandler, false);
  progressItem.addEventListener(oj.ProgressItem.EventType['LOAD'], this._doneHandler, false);
};

oj.ProgressListDataSource.prototype._removeListeners = function(progressItem)
{
  progressItem.removeEventListener(oj.ProgressItem.EventType['PROGRESS'], this._progressHandler, false);
  progressItem.removeEventListener(oj.ProgressItem.EventType['ERROR'], this._errorHandler, false);
  progressItem.removeEventListener(oj.ProgressItem.EventType['LOAD'], this._doneHandler, false);
};


oj.ProgressListDataSource.prototype._resetProgress = function()
{
  this._errors = 0;
  //total size in bytes of files in this collection
  this._totalFileLength = 0;
  //total bytes uploaded so far.
  this._totalUploaded = 0;
};

oj.ProgressListDataSource.prototype._updateOverallLoaded = function(progressItem)
{
  var data;
  var total = 0;
  var loaded = 0;
  var fireEvent = ! progressItem;
  var self = this;

  this._dataSource.fetch({silent: true}).then(function (model) {
    data = model.data;

    for (var item, i = 0; i < data.length; i++)
    {
      item = data[i];
      //Note item is a copy of progressItem
      if (! fireEvent && item.item === progressItem.item)
        fireEvent = true;

      if (item.loaded)
        loaded += item.loaded;

      //TODO: should we check if file is not queued for upload???
//      if (item.status !== oj.ProgressItem.Status['QUEUED'])
        total += item.total;
    }

    if (fireEvent) {
      self._totalUploaded = loaded;
      self._totalFileLength = total;
      self._fireOverallProgressEvent(loaded, total);
    }
  });

};


oj.ProgressListDataSource.prototype._fireOverallProgressEvent = function(loaded, total)
{
  var event = $.Event("overallProgress",
                      {'lengthComputable': true,
                       'total': total,
                       'loaded': loaded,
                       'error': this._errors,
                       'target': this});

  this._dataSource.handleEvent('overallProgress', event);
};


});
