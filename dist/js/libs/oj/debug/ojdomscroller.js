/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";

/**
 * Copyright (c) 2015, Oracle and/or its affiliates.
 * All rights reserved.
 */
define(['ojs/ojcore', 'jquery'], function(oj, $)
{
/* jslint browser: true*/
/*
** Copyright (c) 2004, 2012, Oracle and/or its affiliates. All rights reserved.
*/

/* global Promise:false */
/**
 * @ignore
 * @class oj.DomScroller
 * @classdesc Adds implicit high-water mark scrolling to DOM element
 * @param {Object} element Scrollable DOM element
 * @param {Object} dataprovider dataprovider
 * @param {Object=} options Options for the DomScroller<p>
 *                  <b>asyncIterator</>the iterator for the dataprovider
 *                  <b>success</b>: a user callback called when a fetch has completed successfully after scroll to bottom. Also called with maxCount information if maxCount is reached after scroll to bottom.<br>
 *                  <b>error</b>: a user callback function called if the fetch fails. The callback is called with the failed fetch content.<br>
 *                  <b>fetchSize</b>: the fetch size. Default is 25.<br>
 *                  <b>maxCount</b>: max row count. DomScroller will not exceed this max count. Default is 500.<br>
 *                  <b>initialRowCount</b>: initial row count. DomScroller will be initialized with this row count. Default is 0.<br>
 *                  <b>fetchTrigger</b>: how close should the scroll position be relative to the maximum scroll position before a fetch is triggered. Default is 1 pixel.<br>
 * @constructor
 */
oj.DomScroller = function (element, dataprovider, options) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};
  this._data = dataprovider;
  this._asyncIterator = options.asyncIterator;
  this._element = $(element)[0];
  this._fetchSize = options.fetchSize;
  this._fetchSize = this._fetchSize > 0 ? this._fetchSize : 25;
  this._maxCount = options.maxCount;
  this._maxCount = this._maxCount > 0 ? this._maxCount : 500;
  this._rowCount = options.initialRowCount > 0 ? options.initialRowCount : 0;
  this._successCallback = options.success;
  this._requestCallback = options.request;
  this._errorCallback = options.error;
  this._registerDataSourceEventListeners();
  this._fetchTrigger = options.fetchTrigger;
  if (this._fetchTrigger == null || isNaN(this._fetchTrigger)) {
    this._fetchTrigger = 0;
  }
  this._initialScrollTop = this._element.scrollTop;

  $(this._getScrollEventElement()).on('scroll.domscroller', function () {
    var target = this._element;
    var scrollTop = this._getScrollTop(target);
    var maxScrollTop = target.scrollHeight - target.clientHeight;
    if (maxScrollTop > 0) {
      this._handleScrollerScrollTop(scrollTop, maxScrollTop);
    }
  }.bind(this));
};

/**
 * Update value for fetch trigger
 */
oj.DomScroller.prototype.setFetchTrigger = function (fetchTrigger) {
  if (fetchTrigger != null && !isNaN(fetchTrigger) && fetchTrigger >= 0) {
    this._fetchTrigger = fetchTrigger;
  }
};

/**
 * Retrieve the element where the scroll listener is registered on.
 * @private
 */
oj.DomScroller.prototype._getScrollEventElement = function () {
  // if scroller is the body, listen for window scroll event.  This is the only way that works consistently across all browsers.
  if (this._element === document.body || this._element === document.documentElement) {
    return window;
  }

  return this._element;
};

/**
 * Helper method to calculate the offsetTop from element to ancestor
 * @param {Element} ancestor the ancestor element
 * @param {Element} element the element
 * @return {number} the distance between the specified element and ancestor
 */
oj.DomScroller.calculateOffsetTop = function (ancestor, element) {
  var offset = 0;
  var current = element;
  while (current && current !== ancestor && $.contains(ancestor, current)) {
    offset += current.offsetTop;
    current = current.offsetParent;
  }

  return offset;
};

/**
 * Gets the scroll top of the element
 * @param {Element} element the element
 * @return {number} scroll top
 * @private
 */
oj.DomScroller.prototype._getScrollTop = function (element) {
  var scrollTop = this._fetchTrigger;

  if (element === document.documentElement) {
    // to ensure it works across all browsers.  See https://bugs.webkit.org/show_bug.cgi?id=106133
    // for firefox we should use documentElement.scrollTop, for Chrome and IE use body.scrollTop
    // detect this by checking initial scrollTop is the same as current scrolltop, if it's the same then the scrollTop is not
    // returning the correct value and we should use body.scrollTop
    if (this._useBodyScrollTop === undefined) {
      this._useBodyScrollTop = (this._initialScrollTop === element.scrollTop);
    }

    if (this._useBodyScrollTop) {
      return scrollTop + document.body.scrollTop;
    }
  }

  return scrollTop + element.scrollTop;
};

/**
 * Destroys the dom scroller, unregister any event handlers.
 * @export
 * @expose
 * @memberof! oj.DomScroller
 * @instance
 */
oj.DomScroller.prototype.destroy = function () {
  this._unregisterDataSourceEventListeners();
  $(this._getScrollEventElement()).off('scroll.domscroller');
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
oj.DomScroller.prototype.checkViewport = function () {
  if (this._asyncIterator && this._element.clientHeight > 0 &&
      !this._checkOverflow()) {
    return this._fetchMoreRows();
  }
  return Promise.resolve(null);
};

/**
 * Handle scrollTop on scroller
 * @private
 */
oj.DomScroller.prototype._handleScrollerScrollTop = function (scrollTop, maxScrollTop) {
  if (maxScrollTop - scrollTop <= 1 && scrollTop > this._fetchTrigger && !this._fetchPromise) {
    if (this._asyncIterator) {
      var self = this;
      this._fetchMoreRows().then(function (result) {
        if (self._successCallback) {
          self._successCallback(result);
        }
      }, function (reason) {
        if (self._errorCallback) {
          self._errorCallback(reason);
        }
      });
    } else if (this._errorCallback != null) {
      this._errorCallback();
    }
  }
};

/**
 * Check whether the scroll DOM has overflowed
 * @private
 */
oj.DomScroller.prototype._checkOverflow = function () {
  var element = this._element;

  if (element.scrollHeight > element.clientHeight + this._fetchTrigger) {
    return true;
  }
  return false;
};

/**
 * Try to fetch more rows
 * @private
 */
oj.DomScroller.prototype._fetchMoreRows = function () {
  if (!this._fetchPromise) {
    // make sure we don't exceed maxCount
    var remainingCount = this._maxCount - this._rowCount;
    if (remainingCount > 0) {
      var self = this;

      if (this._asyncIterator) {
        if (this._requestCallback != null) {
          this._requestCallback();
        }
        this._fetchPromise = this._asyncIterator.next().then(function (_result) {
          var result = _result;
          self._fetchPromise = null;

          if (result != null &&
            result.value != null) {
            if (result.value.data.length > 0) {
              self._rowCount += result.value.data.length;

              if (remainingCount < self._fetchSize) {
                result.maxCount = self._maxCount;
                result.maxCountLimit = true;

                if (result.value.data.length > remainingCount) {
                  result.value.data = result.value.data.slice(0, remainingCount);
                  result.value.metadata = result.value.metadata.slice(0, remainingCount);
                  if (result.value.fetchParameters != null) {
                    result.value.fetchParameters.size = remainingCount;
                  }
                }
              }
            }

            // we have exhausted the iterator, discard so we won't attempt to fetch from it again
            if (result.done) {
              self._asyncIterator = null;
            }
          }
          return Promise.resolve(result);
        });
        return this._fetchPromise;
      }
    }
     // we need to indicate that we've hit maxCount
    return Promise.resolve({ maxCount: this._maxCount, maxCountLimit: true });
  }

  return this._fetchPromise;
};

oj.DomScroller.prototype._handleDataRowMutateEvent = function (event) {
  var mutationType = null;
  var eventDetail = null;

  if (event.detail.remove != null) {
    mutationType = 'remove';
    eventDetail = event.detail.remove;
  }
  if (event.detail.add != null) {
    mutationType = 'add';
    eventDetail = event.detail.add;
  }

  if (mutationType != null) {
    var eventIndexes = eventDetail.indexes;
    var eventIndexesCount = eventIndexes.length;
    for (var i = 0; i < eventIndexesCount; i++) {
      var rowIdx = eventIndexes[i];

      // we only care if the row is in our range
      if (rowIdx !== undefined &&
          this._rowCount > 0 &&
          rowIdx <= this._rowCount) {
        if (mutationType === 'add') {
          this._rowCount = this._rowCount + 1;
        } else if (mutationType === 'remove') {
          this._rowCount = this._rowCount - 1;
        }
      }
    }
  }
};

/**
 * Register event listeners which need to be registered datasource.
 * @private
 */
oj.DomScroller.prototype._registerDataSourceEventListeners = function () {
  // register the listeners on the datasource
  var data = this._data;
  if (data != null) {
    this._unregisterDataSourceEventListeners();

    this._dataProviderEventHandlers = [];
    this._dataProviderEventHandlers.push({
      eventType: 'mutate',
      eventHandler: this._handleDataRowMutateEvent.bind(this)
    });

    var i;
    var ev;
    for (i = 0; i < this._dataProviderEventHandlers.length; i++) {
      ev = data.addEventListener(this._dataProviderEventHandlers[i].eventType,
                                 this._dataProviderEventHandlers[i].eventHandler);
      if (ev) {
        this._dataProviderEventHandlers[i].eventHandler = ev;
      }
    }
  }
};

/**
 * Unregister event listeners which are registered on datasource.
 * @private
 */
oj.DomScroller.prototype._unregisterDataSourceEventListeners = function () {
  var data = this._data;
  // unregister the listeners on the datasource
  if (this._dataProviderEventHandlers != null && data != null) {
    var i;
    for (i = 0; i < this._dataProviderEventHandlers.length; i++) {
      data.removeEventListener(this._dataProviderEventHandlers[i].eventType,
                               this._dataProviderEventHandlers[i].eventHandler);
    }
  }
};


});