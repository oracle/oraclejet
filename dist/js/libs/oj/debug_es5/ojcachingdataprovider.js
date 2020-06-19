/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

"use strict";
define(['ojs/ojcore', 'ojs/ojlogger', 'ojs/ojdataprovider'], function(oj, Logger, DataProvider)
{
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AsyncIteratorWrapper = /*#__PURE__*/function () {
  function AsyncIteratorWrapper(asyncIterator, cache, cacheEntries) {
    _classCallCheck(this, AsyncIteratorWrapper);

    this.asyncIterator = asyncIterator;
    this.cache = cache;
    this.cacheEntries = cacheEntries;
  }

  _createClass(AsyncIteratorWrapper, [{
    key: "next",
    value: function next() {
      var _this = this;

      var promise = this.asyncIterator.next();
      promise.then(function (result) {
        var value = result.value;
        var start = _this.cache.data.length;
        var end = start + value.data.length - 1;
        _this.cache.data = _this.cache.data.concat(value.data);
        _this.cache.metadata = _this.cache.metadata.concat(value.metadata);
        _this.cache.done = result.done;

        _this.cacheEntries.push({
          start: start,
          end: end,
          miss: 0,
          status: CacheStatus.READY
        });
      });
      return promise;
    }
  }]);

  return AsyncIteratorWrapper;
}();

var AsyncIterableWrapper = function AsyncIterableWrapper(asyncIterable, cache, cacheEntries) {
  var _this2 = this;

  _classCallCheck(this, AsyncIterableWrapper);

  this.asyncIterable = asyncIterable;
  this.cache = cache;
  this.cacheEntries = cacheEntries;

  this[Symbol.asyncIterator] = function () {
    return new AsyncIteratorWrapper(_this2.asyncIterable[Symbol.asyncIterator](), _this2.cache, _this2.cacheEntries);
  };
};

var CacheEvictionStrategy;

(function (CacheEvictionStrategy) {
  CacheEvictionStrategy[CacheEvictionStrategy["NEVER"] = 0] = "NEVER";
  CacheEvictionStrategy[CacheEvictionStrategy["LRU"] = 1] = "LRU";
})(CacheEvictionStrategy || (CacheEvictionStrategy = {}));

var CacheStatus;

(function (CacheStatus) {
  CacheStatus[CacheStatus["READY"] = 0] = "READY";
  CacheStatus[CacheStatus["FETCHING"] = 1] = "FETCHING";
  CacheStatus[CacheStatus["PURGED"] = 2] = "PURGED";
})(CacheStatus || (CacheStatus = {}));

var FetchDirection;

(function (FetchDirection) {
  FetchDirection[FetchDirection["UP"] = 0] = "UP";
  FetchDirection[FetchDirection["DOWN"] = 1] = "DOWN";
})(FetchDirection || (FetchDirection = {})); // A DataProvider wrapper that supports caching


var CachingDataProvider = /*#__PURE__*/function () {
  function CachingDataProvider(dataProvider, cache, options) {
    _classCallCheck(this, CachingDataProvider);

    this.dataProvider = dataProvider;
    this.cache = cache;
    this.options = options;
    this.strategy = CacheEvictionStrategy.NEVER;
    this.prefetching = false;
    this.currentStart = 0;
    this.CACHE_MISS_THRESHOLD = 5;

    if (cache == null) {
      this.cache = {
        data: [],
        metadata: [],
        done: false,
        startIndex: 0
      };
    }

    this.cacheQueue = [];
    this.modelEventHandler = this._handleModelEvent.bind(this);
    dataProvider.addEventListener('mutate', this.modelEventHandler);
    dataProvider.addEventListener('refresh', this.modelEventHandler);
  }

  _createClass(CachingDataProvider, [{
    key: "destroy",
    value: function destroy() {
      if (this.dataProvider && this.modelEventHandler) {
        this.dataProvider.removeEventListener('mutate', this.modelEventHandler);
        this.dataProvider.removeEventListener('refresh', this.modelEventHandler);
      }
    }
    /**
     * Fetch the first block of data
     */

  }, {
    key: "fetchFirst",
    value: function fetchFirst(params) {
      // clear cache
      this._resetCache();

      var result = this.dataProvider.fetchFirst(params);
      var iterable = new AsyncIterableWrapper(result, this.cache, this.cacheQueue);
      return iterable;
    }
    /**
     * Fetch rows by keys
     */

  }, {
    key: "fetchByKeys",
    value: function fetchByKeys(params) {
      return this.dataProvider.fetchByKeys(params);
    }
    /**
     * Check if rows are contained by keys
     */

  }, {
    key: "containsKeys",
    value: function containsKeys(params) {
      return this.dataProvider.containsKeys(params);
    }
    /**
     * Fetch rows by offset
     * This is also used by this DataProvider to know what the active range is so that it can purge its cache accordingly
     */

  }, {
    key: "fetchByOffset",
    value: function fetchByOffset(params) {
      var _this3 = this;

      if (this.proximity === undefined) {
        this.proximity = params.size;
      } // direction serves as a hint of where to pre-fetch


      var direction = FetchDirection.UP;
      var start = params.offset;
      var end = start + params.size;

      if (start > this.currentStart) {
        direction = FetchDirection.DOWN;
      }

      this.currentStart = start;

      if (!this._isInCache(start, end)) {
        Logger.info('Cache missed: ' + start + ' - ' + end);
        this.cacheQueue.forEach(function (cacheInfo) {
          if (cacheInfo.status !== CacheStatus.FETCHING) {
            if (cacheInfo.start >= start && cacheInfo.start <= end || cacheInfo.end <= end && cacheInfo.end >= start) {
              _this3._log('cache entry update to FETCHING - start: ' + cacheInfo.start + ' end: ' + cacheInfo.end);

              cacheInfo.status = CacheStatus.FETCHING;
            } else {
              cacheInfo.miss = cacheInfo.miss + 1;
            }
          }
        });
        this.fetchByOffsetPromise = new Promise(function (resolve, reject) {
          _this3._log('Call fetchByOffset to fulfill cache');

          _this3.dataProvider.fetchByOffset(params).then(function (result) {
            for (var i = 0; i < result.results.length; i++) {
              var item = result.results[i];
              _this3.cache.data[start + i] = item.data;
              _this3.cache.metadata[start + i] = item.metadata;
            }

            _this3._log('cache fulfilled - offset: ' + start + ' size: ' + result.results.length);

            _this3.cacheQueue.forEach(function (cacheInfo) {
              if (cacheInfo.status === CacheStatus.FETCHING) {
                _this3._log('cache entry update to READY - start: ' + cacheInfo.start + ' end: ' + cacheInfo.end);

                cacheInfo.status = CacheStatus.READY;
                cacheInfo.miss = 0;
              }
            });

            var results = _this3._getFetchByOffsetResult(start, end);

            resolve({
              results: results,
              fetchParameters: params,
              done: false
            }); // see if we need to pre-fetch more

            _this3._recalibrateCache(start, end, direction);
          });
        });
        return this.fetchByOffsetPromise;
      }

      this._updateCacheEntries(start, end); // must be called before cache is recalibrated


      var results = this._getFetchByOffsetResult(start, end);

      this._recalibrateCache(start, end, direction);

      return Promise.resolve({
        results: results,
        fetchParameters: params,
        done: false
      });
    }
  }, {
    key: "_updateCacheEntries",
    value: function _updateCacheEntries(start, end) {
      this.cacheQueue.forEach(function (cacheInfo) {
        if (cacheInfo.status !== CacheStatus.PURGED) {
          if (cacheInfo.start > end || cacheInfo.end < start) {
            cacheInfo.miss = cacheInfo.miss + 1;
          } else {
            cacheInfo.miss = 0;
          }
        }
      });
    }
  }, {
    key: "_getFetchByOffsetResult",
    value: function _getFetchByOffsetResult(start, end) {
      var relStart = start - this.cache.startIndex;
      var relEnd = end - this.cache.startIndex;
      var results = [];

      for (var i = relStart; i < relEnd; i++) {
        results.push({
          data: this.cache.data[i],
          metadata: this.cache.metadata[i]
        });
      }

      return results;
    }
    /**
     * Returns the total size of the data
     */

  }, {
    key: "getTotalSize",
    value: function getTotalSize() {
      return this.dataProvider.getTotalSize();
    }
    /**
     * Returns a string that indicates if this data provider is empty.
     * Returns "unknown" if the dataProvider has not resolved yet.
     */

  }, {
    key: "isEmpty",
    value: function isEmpty() {
      return this.dataProvider.isEmpty();
    }
    /**
     * Determines whether this DataProvider supports certain feature.
     */

  }, {
    key: "getCapability",
    value: function getCapability(capabilityName) {
      return this.dataProvider.getCapability(capabilityName);
    }
    /** EVENT TARGET IMPLEMENTATION **/

  }, {
    key: "addEventListener",
    value: function addEventListener(eventType, listener) {
      this.dataProvider.addEventListener(eventType, listener);
    }
  }, {
    key: "removeEventListener",
    value: function removeEventListener(eventType, listener) {
      this.dataProvider.removeEventListener(eventType, listener);
    }
  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      return this.dataProvider.dispatchEvent(event);
    }
  }, {
    key: "_handleModelEvent",
    value: function _handleModelEvent(event) {
      if (event.type === 'refresh') {
        this._handleRowsRefreshed();
      } else if (event.type === 'mutate') {
        // todo: don't need this if evt is correctly typed
        var detail = event['detail'];

        if (detail.add) {
          this._handleRowsAdded(detail.add);
        }

        if (detail.remove) {
          this._handleRowsRemoved(detail.remove);
        }

        if (detail.update) {
          this._handleRowsUpdated(detail.update);
        }
      }
    }
  }, {
    key: "_resetCache",
    value: function _resetCache() {
      this.cache.data.length = 0;
      this.cache.metadata.length = 0;
      this.cache.startIndex = 0;
      this.cache.done = false;
      this.cacheQueue.length = 0;
    }
  }, {
    key: "_recalibrateCache",
    value: function _recalibrateCache(start, end, direction) {
      var _this4 = this;

      if (this.strategy === CacheEvictionStrategy.NEVER) {
        return;
      } // first purge the cache that are LRU whose outside of current proximity range


      this.cacheQueue.forEach(function (cacheInfo) {
        if (cacheInfo.status === CacheStatus.READY && cacheInfo.miss >= _this4.CACHE_MISS_THRESHOLD && (cacheInfo.end < start - _this4.proximity || cacheInfo.start > end + _this4.proximity)) {
          _this4._log('Purging cache range: ' + cacheInfo.start + ' to ' + cacheInfo.end); // for now we are just nulling out the data/metadata, todo: reduce the array if it's possible


          for (var i = cacheInfo.start; i <= cacheInfo.end; i++) {
            _this4.cache.data[i] = null;
            _this4.cache.metadata[i] = null;
          }

          cacheInfo.status = CacheStatus.PURGED;
        }
      });

      this._dumpCacheStatus();

      if (this.prefetching === false) {
        return;
      } // next pre-fetch to populate cache in anticipation of the next fetch


      var _loop = function _loop(i) {
        var entry = _this4.cacheQueue[i]; // find the right CacheEntry of what the next fetch might be

        if (direction === FetchDirection.UP && entry.start < start && entry.end > start) {
          if (entry.status === CacheStatus.PURGED || !_this4._isInCache(entry.start, entry.end)) {
            entry.status = CacheStatus.FETCHING;

            _this4._log('pre-fetch cache range (before adjustment): ' + entry.start + ' - ' + entry.end + ' direction: ' + direction);

            _this4._prefetchRange(entry.start, start - entry.start).then(function (success) {
              entry.status = CacheStatus.READY;
            });
          }

          return "break";
        } else if (direction === FetchDirection.DOWN && entry.start < end && entry.end > end) {
          if (entry.status === CacheStatus.PURGED || !_this4._isInCache(entry.start, entry.end)) {
            entry.status = CacheStatus.FETCHING;

            _this4._log('pre-fetch cache range (before adjustment): ' + entry.start + ' - ' + entry.end + ' direction: ' + direction);

            _this4._prefetchRange(end, entry.end - end).then(function (success) {
              entry.status = CacheStatus.READY;
            });
          }

          return "break";
        }
      };

      for (var i = 0; i < this.cacheQueue.length; i++) {
        var _ret = _loop(i);

        if (_ret === "break") break;
      }
    }
  }, {
    key: "_prefetchRange",
    value: function _prefetchRange(start, size) {
      var _this5 = this;

      this._log('pre-fetching to refill cache - offset: ' + start + ' size: ' + size);

      return new Promise(function (resolve, reject) {
        _this5.dataProvider.fetchByOffset({
          offset: start,
          size: size
        }).then(function (result) {
          for (var i = 0; i < result.results.length; i++) {
            var item = result.results[i];
            _this5.cache.data[start + i] = item.data;
            _this5.cache.metadata[start + i] = item.metadata;
          }

          _this5._log('pre-fetch result returned and cache is fulfilled - offset: ' + start + ' size: ' + size);

          resolve(true);
        });
      });
    }
  }, {
    key: "_isInCache",
    value: function _isInCache(start, end) {
      if (this.strategy === CacheEvictionStrategy.NEVER) {
        return true;
      }

      if (start < this.cache.startIndex || end > this.cache.startIndex + this.cache.data.length) {
        return false;
      }

      var relStart = start - this.cache.startIndex;
      var relEnd = end - this.cache.startIndex;

      for (var i = relStart; i < relEnd; i++) {
        if (this.cache.data[i] == null) {
          return false;
        }
      }

      return true;
    }
    /**
     * Helper method for handling mutation event
     * @param detail
     * @param keyField
     * @param callback1
     * @param callback2
     */

  }, {
    key: "_handleRowsMutated",
    value: function _handleRowsMutated(detail, keyField, callback1, callback2) {
      var _this6 = this;

      var indexes = detail.indexes;

      if (indexes == null) {
        var keys = detail[keyField];
      } else {
        indexes.forEach(function (index, i) {
          if (index < _this6.cache.startIndex + _this6.cache.data.length) {
            if (index >= _this6.cache.startIndex) {
              // within fetched range, update cache
              var data = detail.data != null ? detail.data[i] : null;
              var metadata = detail.metadata != null ? detail.metadata[i] : null;
              callback1(index, data, metadata);
            } else {
              if (callback2) {
                callback2();
              }
            }
          } // if it's after the current cache range then we don't need to do anything as it gets
          // re-populated correctly when the next set of data is fetched

        });
      }
    }
  }, {
    key: "_handleRowsAdded",
    value: function _handleRowsAdded(detail) {
      var _this7 = this;

      this._log('handling add mutation event');

      this._handleRowsMutated(detail, 'addBeforeKeys', function (index, data, metadata) {
        _this7.cache.data.splice(index, 0, data);

        _this7.cache.metadata.splice(index, 0, metadata);
      }, function () {
        _this7.cache.startIndex++;
      });
    }
  }, {
    key: "_handleRowsRemoved",
    value: function _handleRowsRemoved(detail) {
      var _this8 = this;

      this._log('handling remove mutation event');

      this._handleRowsMutated(detail, 'keys', function (index) {
        _this8.cache.data.splice(index, 1);

        _this8.cache.metadata.splice(index, 1);
      }, function () {
        _this8.cache.startIndex = Math.max(0, _this8.cache.startIndex - 1);
      });
    }
  }, {
    key: "_handleRowsUpdated",
    value: function _handleRowsUpdated(detail) {
      var _this9 = this;

      this._log('handling update mutation event');

      this._handleRowsMutated(detail, 'keys', function (index, data, metadata) {
        _this9.cache.data.splice(index, 1, data);

        _this9.cache.metadata.splice(index, 1, metadata);
      });
    }
  }, {
    key: "_handleRowsRefreshed",
    value: function _handleRowsRefreshed() {
      this._log('handling refresh event');

      this._resetCache();
    }
  }, {
    key: "_log",
    value: function _log(msg) {
      Logger.info('[CachingDataProvider]=> ' + msg);
    }
  }, {
    key: "_getStatusText",
    value: function _getStatusText(status) {
      switch (status) {
        case CacheStatus.READY:
          return 'ready';

        case CacheStatus.FETCHING:
          return 'fetching';

        case CacheStatus.PURGED:
          return 'purged';

        default:
          return 'unknown';
      }
    }
  }, {
    key: "_dumpCacheStatus",
    value: function _dumpCacheStatus() {
      var _this10 = this;

      this.cacheQueue.forEach(function (cacheInfo) {
        _this10._log('Cache entry - start: ' + cacheInfo.start + ' end: ' + cacheInfo.end + ' miss: ' + cacheInfo.miss + ' status: ' + _this10._getStatusText(cacheInfo.status));
      });
    }
  }]);

  return CachingDataProvider;
}();

  return CachingDataProvider;
});