/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'jquery', 'ojs/ojdatacollection-common', 'ojs/ojlogger'], function (oj, $, DataCollectionUtils, Logger) { 'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;
  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;

  /* jslint browser: true*/
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
   * @ojtsmodule
   */
  const DomScroller = function (element, dataprovider, options) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._data = dataprovider;
    this._asyncIterator = options.asyncIterator;
    this._element = $(element)[0];
    this._contentElement = options.contentElement;
    this._fetchSize = options.fetchSize;
    this._fetchSize = this._fetchSize > 0 ? this._fetchSize : 25;
    this._maxCount = options.maxCount;
    this._maxCount = this._maxCount > 0 ? this._maxCount : 500;
    this._rowCount = options.initialRowCount > 0 ? options.initialRowCount : 0;
    this._successCallback = options.success;
    this._requestCallback = options.request;
    this._errorCallback = options.error;
    this._isOverflowCallback = options.isOverflow;
    this._beforeFetchCallback = options.beforeFetch;
    this._beforeScrollCallback = options.beforeScroll;
    this._localKeyValidator = options.localKeyValidator;
    this._registerDataSourceEventListeners();
    this._fetchTrigger = options.fetchTrigger;
    if (this._fetchTrigger == null || isNaN(this._fetchTrigger)) {
      this._fetchTrigger = 0;
    }
    this._initialScrollTop = this._element.scrollTop;
    this._lastFetchTrigger = 0;
    this._isScrollTriggeredByMouseWheel = false;
    this._checkViewportCount = 0;
    this._fetchThreshold = 0.25;

    var elem = this._getScrollEventElement();
    this._scrollEventListener = function () {
      if (this._beforeScrollCallback) {
        this._beforeScrollCallback();
      }
      var scrollTop = this._element.scrollTop;
      var scrollerHeight = this._element.clientHeight;
      var maxScrollTop = this._element.scrollHeight - scrollerHeight;
      if (maxScrollTop > 0) {
        if (this._contentElement) {
          this._handleExternalScrollerScrollTop(scrollTop, scrollerHeight);
        } else {
          this._handleScrollerScrollTop(scrollTop, maxScrollTop);
        }
      }
    }.bind(this);
    elem.addEventListener('scroll', this._scrollEventListener);

    this._wheelEventListener = function () {
      this._isScrollTriggeredByMouseWheel = true;
    }.bind(this);
    elem.addEventListener('wheel', this._wheelEventListener, { passive: true });

    this._mouseDownEventListener = function () {
      this._isScrollTriggeredByMouseWheel = false;
    }.bind(this);
    elem.addEventListener('mousedown', this._mouseDownEventListener);
  };

  /**
   * Update the async iterator which could have been removed previous because
   * iterator has been exhausted
   */
  DomScroller.prototype.setAsyncIterator = function (asyncIterator) {
    this._asyncIterator = asyncIterator;
  };

  /**
   * Update value for fetch trigger
   */
  DomScroller.prototype.setFetchTrigger = function (fetchTrigger) {
    if (fetchTrigger != null && !isNaN(fetchTrigger) && fetchTrigger >= 0) {
      this._fetchTrigger = fetchTrigger;
    }
  };

  /**
   * Retrieve the element where the scroll listener is registered on.
   * @private
   */
  DomScroller.prototype._getScrollEventElement = function () {
    // if scroller is the body, listen for window scroll event.  This is the only way that works consistently across all browsers.
    if (this._element === document.body || this._element === document.documentElement) {
      return window;
    }

    return this._element;
  };

  /**
   * Destroys the dom scroller, unregister any event handlers.
   * @export
   * @expose
   * @memberof! oj.DomScroller
   * @instance
   */
  DomScroller.prototype.destroy = function () {
    this._unregisterDataSourceEventListeners();
    var elem = this._getScrollEventElement();
    if (elem) {
      elem.removeEventListener('scroll', this._scrollEventListener);
      elem.removeEventListener('wheel', this._wheelEventListener, { passive: true });
      elem.removeEventListener('mousedown', this._mouseDownEventListener);
    }
  };

  /**
   * Check the viewport to see if a fetch needs to be done to fill it. Fetch if it does.
   * @param {boolean=} forceFetch true if a fetch should be forced even if overflow is detected
   * @return {Promise} Return a Promise which contains either the content of the fetch
   *                   or maxCount information if it has reached maxCount. Promise resolves to null if no fetch was done.
   * @throws {Error}
   * @export
   * @expose
   * @memberof! oj.DomScroller
   * @instance
   */
  DomScroller.prototype.checkViewport = function (forceFetch) {
    if (
      this._asyncIterator &&
      this._element.clientHeight > 0 &&
      (forceFetch || !this.isOverflow() || this._isEndReached())
    ) {
      this._checkViewportCount += 1;
      if (this._checkViewportCount === DataCollectionUtils.CHECKVIEWPORT_THRESHOLD) {
        Logger.warn(
          'Viewport not satisfied after multiple fetch, make sure the component is height constrained or specify a scroller.'
        );
      }
      if (this._beforeFetchCallback(this._element.scrollTop, true)) {
        return this._fetchMoreRows();
      }
    }
    this._checkViewportCount = 0;
    return Promise.resolve(null);
  };

  /**
   * Fetch more rows if beforeFetch callback allows it
   * @private
   */
  DomScroller.prototype._doFetch = function (scrollTop) {
    var self = this;

    if (this._beforeFetchCallback(scrollTop - this._fetchTrigger, false)) {
      this._lastFetchTrigger = scrollTop;

      var isMouseWheel = self._isScrollTriggeredByMouseWheel;
      this._fetchPromise = this._fetchMoreRows().then(
        function (result) {
          if (self._successCallback) {
            // eslint-disable-next-line no-param-reassign
            result.isMouseWheel = isMouseWheel;
            self._successCallback(result);
            self._fetchPromise = null;
            // re-calculated on next scroll
            self._nextFetchTrigger = undefined;
          }
        },
        function (reason) {
          if (self._errorCallback) {
            self._errorCallback(reason);
            self._fetchPromise = null;
            self._nextFetchTrigger = undefined;
          }
        }
      );
    } else {
      // items not rendered yet, reset nextFetchTrigger so it gets calculated again
      this._nextFetchTrigger = undefined;
    }
  };

  DomScroller.prototype._handleExternalScrollerScrollTop = function (scrollTop, scrollerHeight) {
    if (!this._fetchPromise && this._asyncIterator) {
      var bounds = this._contentElement.getBoundingClientRect();
      var bottom = bounds.bottom - this._fetchTrigger - bounds.height * this._fetchThreshold;
      if (bottom <= scrollerHeight) {
        this._doFetch(scrollTop);
      }
    }
  };

  /**
   * Handle scrollTop on scroller
   * @private
   */
  DomScroller.prototype._handleScrollerScrollTop = function (scrollTop, maxScrollTop) {
    if (!this._fetchPromise && this._asyncIterator) {
      if (maxScrollTop !== this._lastMaxScrollTop) {
        this._nextFetchTrigger = Math.max(0, (maxScrollTop - this._fetchTrigger - scrollTop) / 2);
        this._lastMaxScrollTop = maxScrollTop;
      }

      if (
        this._nextFetchTrigger != null &&
        scrollTop - this._lastFetchTrigger > this._nextFetchTrigger
      ) {
        this._doFetch(scrollTop);

        // note beforeFetchCallback would return false if the render queue is non-empty
        // in which case we should just wait until the next idle cycle to clear the queue
        return;
      }
    }

    if (maxScrollTop - scrollTop < 1 && scrollTop > this._fetchTrigger) {
      if (this._fetchPromise) {
        // at the bottom but fetch has not return yet, in which case we will block UI via requestCallback
        if (this._asyncIterator) {
          if (this._requestCallback != null) {
            this._requestCallback();
          }
        } else if (this._errorCallback != null) {
          this._errorCallback();
        }
      } else if (this._asyncIterator) {
        // at the bottom and all items from last fetch are rendered, start a new fetch
        this._doFetch(scrollTop);
      }
    }
  };

  /**
   * Check whether the scroll DOM has overflowed
   * @return {boolean} true if overflowed, false otherwise
   */
  DomScroller.prototype.isOverflow = function () {
    if (this._isOverflowCallback) {
      return this._isOverflowCallback();
    }

    var scrollHeight = this._contentElement
      ? this._contentElement.scrollHeight
      : this._element.scrollHeight;
    var diff = scrollHeight - (this._element.clientHeight + this._fetchTrigger);
    if (diff === 1 && oj.AgentUtils.getAgentInfo().browser === oj.AgentUtils.BROWSER.EDGE) {
      // hitting Edge , see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/21405284/
      // note this will only happen with non-height-bounded ListView with loadMoreOnScroll, see 
      diff = 0;
    }

    return diff > 0;
  };

  /**
   * @private
   */
  DomScroller.prototype._isEndReached = function () {
    if (
      this._element.scrollHeight - this._element.clientHeight - this._element.scrollTop <
      Math.max(1, this._fetchTrigger)
    ) {
      // this could happen if the offsetTop is not correct
      return true;
    }
    return false;
  };

  /**
   * Try to fetch more rows
   * @private
   */
  DomScroller.prototype._fetchMoreRows = function () {
    if (!this._fetchPromise) {
      // make sure we don't exceed maxCount
      var remainingCount = this._maxCount - this._rowCount;
      if (remainingCount > 0) {
        var self = this;

        if (this._asyncIterator) {
          this._fetchPromise = this._asyncIterator.next().then(function (_result) {
            var result = _result;
            self._fetchPromise = null;

            if (result != null && result.value != null) {
              var dataLength = result.value.data.length;
              if (dataLength > 0) {
                self._rowCount += dataLength;

                if (remainingCount <= dataLength) {
                  result.maxCount = self._maxCount;
                  result.maxCountLimit = true;

                  if (dataLength > remainingCount) {
                    result.value.data = result.value.data.slice(0, remainingCount);
                    result.value.metadata = result.value.metadata.slice(0, remainingCount);
                    if (result.value.fetchParameters != null) {
                      result.value.fetchParameters.size = remainingCount;
                    }
                  }
                }
              }

              // we have exhausted the iterator, discard so we won't attempt to fetch from it again
              if (result.done || result.maxCountLimit) {
                self._asyncIterator = null;
              }
            }
            return Promise.resolve(result);
          });
          return this._fetchPromise;
        }
      }
      // we need to indicate that we've hit maxCount
      this._asyncIterator = null;
      return Promise.resolve({ maxCount: this._maxCount, maxCountLimit: true });
    }

    return this._fetchPromise;
  };

  /**
   * @private
   */
  DomScroller.prototype._handleDataRowMutateEvent = function (event) {
    // if everything has been fetched already then we don't have to do anything also
    if (this._asyncIterator == null) {
      return;
    }

    var eventDetail;
    var indexes;
    var keys;
    var self = this;

    if (event.detail.add != null) {
      eventDetail = event.detail.add;
      // for add, it exists if index is in range, or before/after key is in range
      if (eventDetail.indexes != null) {
        indexes = eventDetail.indexes;
      } else if (eventDetail.addBeforeKeys != null) {
        keys = eventDetail.addBeforeKeys;
      } else if (eventDetail.afterKeys != null) {
        // deprecated but still needs to support it
        keys = eventDetail.afterKeys;
      } else {
        // no keys and indexes, then it's inserting to the end
        // since we already bail when there are nothing to fetch, the only
        // case is when we have not reached the end yet, in which case
        // we should not do anything since it's outside of range
      }

      this._handleDataRowAddedOrRemoved(keys, indexes, function () {
        self._rowCount += 1;
      });
    }

    if (event.detail.remove != null) {
      eventDetail = event.detail.remove;
      // for remove, it exists if index or key is in range
      if (eventDetail.indexes != null) {
        indexes = eventDetail.indexes;
      } else if (eventDetail.keys != null) {
        keys = eventDetail.keys;
      }

      this._handleDataRowAddedOrRemoved(keys, indexes, function () {
        self._rowCount -= 1;
      });
    }
  };

  /**
   * @private
   */
  DomScroller.prototype._handleDataRowAddedOrRemoved = function (keys, indexes, callback) {
    if (indexes) {
      for (var i = 0; i < indexes.length; i++) {
        var rowIdx = indexes[i];
        // we only care if the row is in our range
        if (rowIdx !== undefined && this._rowCount > 0 && rowIdx <= this._rowCount) {
          callback();
        }
      }
    } else if (keys) {
      var keyValidator = this._localKeyValidator;
      if (keyValidator != null) {
        // forEach works for both Array and Set
        keys.forEach(function (key) {
          if (keyValidator(key)) {
            callback();
          }
        });
      }
    }
  };

  /**
   * Register event listeners which need to be registered datasource.
   * @private
   */
  DomScroller.prototype._registerDataSourceEventListeners = function () {
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
        ev = data.addEventListener(
          this._dataProviderEventHandlers[i].eventType,
          this._dataProviderEventHandlers[i].eventHandler
        );
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
  DomScroller.prototype._unregisterDataSourceEventListeners = function () {
    var data = this._data;
    // unregister the listeners on the datasource
    if (this._dataProviderEventHandlers != null && data != null) {
      var i;
      for (i = 0; i < this._dataProviderEventHandlers.length; i++) {
        data.removeEventListener(
          this._dataProviderEventHandlers[i].eventType,
          this._dataProviderEventHandlers[i].eventHandler
        );
      }
    }
  };

  return DomScroller;

});
