/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./defaultCacheHandler", "../persistenceStoreManager", "../persistenceUtils", "./logger"], function (cacheHandler, persistenceStoreManager, persistenceUtils, logger) {
  'use strict';

  /**
   * OfflineCache module.
   * Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * In additional to functionalities provided by the standard Cache API, this
   * OfflineCache also interacts with shredding methods for more fine-grain
   * caching. In addition to the Cache API, the OfflineCache also supports
   * the clear() function to clear the cache.
   * @module OfflineCache
   */

  /**
   * @export
   * @class OfflineCache
   * @classdesc  Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * @constructor
   * @param {String} name name of the cache
   * @param {String} store name for cache storage
   */
  function OfflineCache (name, storeName) {
    if (!name) {
      throw TypeError("A name must be provided to create an OfflineCache!");
    }
    if (!storeName) {
      throw TypeError("A persistence store must be provided to create an OfflineCache!");
    }

    this._name = name;
    this._storeName = storeName;
    // the names of all the shredded stores associated
    // with this cache. We need them when clear() is
    // called since we need to clear all the shredded
    // stores as well.
    this._shreddedNamesStoreName = this._storeName + '_OPT_INT_SHRED_STORE_NAMES_';
    this._store = null;

    // in-memory cache of all the keys in the store, for quick lookup.
    this._cacheKeys = [];
    this._createStorePromise;
  }

  /**
   * Retrieve the name of the cache object.
   * @method
   * @name getName
   * @memberof! OfflineCache
   * @instance
   * @return {string} Returns the name of the cache object.
   */
  OfflineCache.prototype.getName = function () {
    return this._name;
  };

  /**
   * Takes a request, retrieves it and adds the resulting response
   * object to the cache.
   * @method
   * @name add
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to fetch for response
   *                          and be cached.
   * @return {Promise} returns a Promise that is resolved when the reponse
   *                           is retrieved and request/response is cached.
   */
  OfflineCache.prototype.add = function (request) {
    logger.log("Offline Persistence Toolkit OfflineCache: add()");
    var self = this;
    return fetch(request).then(function (response) {
      return self.put(request, response);
    });
  };

  /**
   * Bulk operation of add.
   * @method
   * @name addAll
   * @memberof! OfflineCache
   * @param {Array} requests An array of Request
   * @return {Promise} Returns a promise when all the requests in the array are handled.
   */
  OfflineCache.prototype.addAll = function (requests) {
    logger.log("Offline Persistence Toolkit OfflineCache: addAll()");
    var promises = requests.map(this.add, this);
    return Promise.all(promises);
  };

  /**
   * Find the first response in this Cache object that match the request with the options.
   * @method
   * @name match
   * @memberof! OfflineCache
   * @instance
   * @param {Request} a request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a Promise that resolves to the Response associated with the
   *                           first matching request in the Cache object. If no match is
   *                           found, the Promise resolves to undefined.
   */
  OfflineCache.prototype.match = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: match() for Request with url: " + request.url);
    var self = this;

    return self._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      if (!matchEntry) {
        return;
      }
      return _cacheEntryToResponse(request, matchEntry.value.responseData, options);
    }).catch(function(error) {
      logger.log('error finding match for request with url: ' + request.url);
      return;
    });
  };

  OfflineCache.prototype._getCacheEntries = function (request, options) {
    var self = this;
    return this._getStore().then(function(store) {
      var possibleKeys = cacheHandler.getMatchedCacheKeys(request, options, self._cacheKeys);
      if (possibleKeys && possibleKeys.length) {
        var promises = possibleKeys.map(function(key) {
          return store.findByKey(key).then(function(value) {
            return {key: key, value: value};
          });
        });
        return Promise.all(promises);
      } else {
        // get the cache entries based on search criteria.
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria['fields'] = ['key', 'value'];
        return store.find(searchCriteria);
      }
    });
  };

  // find the response from the cache that matches the request based on
  // cache key value.
  OfflineCache.prototype._matchByKey = function (request, key, options) {
    return this._getStore().then(function(store) {
      return store.findByKey(key);
    }).then(function(cacheData) {
      if (!cacheData) {
        return;
      } else {
        return _cacheEntryToResponse(request, cacheData.responseData, options);
      }
    });
  };

  // internal match that only returns the needed metadata that includes:
  //   key: key of the cache entry in the cache store.
  //   resourceType: whether the response body is a collection type of resource
  //                 or single type of resourse
  //   resourceIdentifier: the resourse identifier value of the cached response.
  // This is called from queryHandler which needs the metadata information
  // to handle the query.
  OfflineCache.prototype._internalMatch = function (request, options) {
    // return key and headers. always skip search, always skip body.
    var self = this;
    return self._getStore().then(function(store) {
      var possibleKeys = cacheHandler.getMatchedCacheKeys(request, options, self._cacheKeys);
      if (possibleKeys && possibleKeys.length) {
        var promises = possibleKeys.map(function(key) {
          return store.findByKey(key);
        });
        return Promise.all(promises).then(function(results) {
          return results.map(function(result, index) {
            return {key: possibleKeys[index], value: result};
          });
        });
      } else {
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria['fields'] = ['key', 'value'];
        return store.find(searchCriteria);
      }
    }).then(function (cacheEntries) {
      if (!cacheEntries) {
        return;
      }
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      if (matchEntry) {
        var returnValue = {key: matchEntry.key};
        var bodyAbstractText = matchEntry.value.responseData.bodyAbstract;
        if (bodyAbstractText) {
          try {
            var bodyAbstract = JSON.parse(bodyAbstractText);
            if (bodyAbstract) {
              if (bodyAbstract.length === 1 && bodyAbstract[0].resourceType === 'single') {
                returnValue.resourceType = 'single';
              } else {
                returnValue.resourceType = 'collection';
              }
            } else {
              returnValue.resourceType = 'unknown';
            }
          } catch (exp) {
            logger.log('internal error: invalid body abstract');
            return;
          }
        } else {
          // this is for the case where there is no thredder, thus
          // no bodyAbstract.
          returnValue.resourceType = 'unknown';
        }
        return returnValue;
      } else {
        return;
      }
    }).catch(function(error) {
      logger.log('error finding match internal');
      return;
    });
  };

  /**
   * Finds all responses whose request matches the passed-in request with the specified
   * options.
   * @method
   * @name matchAll
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise } Returns a Promise that resolves to an array of response objects
   *                            whose request matches the passed-in request.
   */
  OfflineCache.prototype.matchAll = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: matchAll() for Request with url: " + request.url);

    return this._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var responseDataArray = _applyVaryForAllMatches(ignoreVary, request, cacheEntries);
      return _cacheEntriesToResponses(request, responseDataArray, options);
    }).catch(function(error) {
      logger.log('error finding all matches for request with url: ' + request.url);
      return;
    });
  };

  /**
   * Return the persistent store.
   * @returns {Object} The persistent store.
   */
  OfflineCache.prototype._getStore = function () {
    var self = this;
    if (self._store) {
      return Promise.resolve(self._store);
    }
    if (self._createStorePromise) {
      return self._createStorePromise;
    } else {
      var localStore;
      self._createStorePromise = persistenceStoreManager.openStore(self._storeName, {
        index: ["metadata.baseUrl", "metadata.url", "metadata.created"],
        skipMetadata: true
      }).then(function (store) {
        localStore = store;
        return store.keys();
      }).then(function (keys) {
        self._cacheKeys = keys;
        self._store = localStore;
        return self._store;
      });
      return self._createStorePromise;
    }
  }

    /**
   * Return the persistent store.
   * @returns {Object} The persistent store.
   */
  OfflineCache.prototype._getShreddedNamesStore = function () {
    var self = this;
    if (self._shreddedNamesStore) {
      return Promise.resolve(self._shreddedNamesStore);
    }
    if (self._createShreddedNamesStorePromise) {
      return self._createShreddedNamesStorePromise;
    } else {
      self._createShreddedNamesStorePromise = persistenceStoreManager.openStore(self._shreddedNamesStoreName, {
        index: ["metadata.baseUrl", "metadata.url", "metadata.created"],
        skipMetadata: true
     }).then(function (store) {
        self._shreddedNamesStore = store;
        return self._shreddedNamesStore;
      });
      return self._createShreddedNamesStorePromise;
    }
  }

  /**
   * Perform vary header check and return the first match among all the
   * cacheEntries.
   * @param {boolean} ignoreVary Whether to ignore vary or not.
   * @param {Object} request Request to check against.
   * @param {Array} cacheEntries An array of cache entry to be checked among.
   * @returns {Object} The first match entry.
   */
 function _applyVaryForSingleMatch (ignoreVary, request, cacheEntries) {
   if (cacheEntries && cacheEntries.length) {
     for (var index = 0; index < cacheEntries.length; index++) {
       var cacheEntry = cacheEntries[index];
       if (_applyVaryCheck(ignoreVary, request, cacheEntry.value)) {
         return cacheEntry;
       }
     }
   }
   return null;
 };

  /**
   * Perform vary header check and return the all entries that match the request
   * on vary.
   * @param {boolean} ignoreVary Whether to ignore vary or not.
   * @param {Object} request Request to check against.
   * @param {Array} cacheEntries An array of cache entry to be checked among.
   * @returns {Array} The array of the cache entries that match request on vary
   *                  header.
   */
  function _applyVaryForAllMatches (ignoreVary, request, cacheEntries) {
    var responseDataArray = [];
    if (cacheEntries && cacheEntries.length) {
      var filteredArray = cacheEntries.filter(_filterByVary(ignoreVary, request, 'value'));
      responseDataArray = filteredArray.map(function (entry) {return entry.value.responseData;});
    }
    return responseDataArray;
  };

  // callback function supplied to Array.filter() method to filter entries
  // based on vary header.
  function _filterByVary (ignoreVary, request, propertyName) {
    return function (cacheValue) {
      var propertyValue;
      if (propertyName) {
        propertyValue = cacheValue[propertyName];
      } else {
        propertyValue = cacheValue;
      }
      return _applyVaryCheck(ignoreVary, request, propertyValue);
    };
  };

  // perform the vary header check.
  function _applyVaryCheck (ignoreVary, request, cacheValue) {
    if (ignoreVary) {
      return true;
    }

    if (!cacheValue || !request) {
      return false;
    }

    var cacheRequestHeaders = cacheValue.requestData.headers;
    var cacheResponseHeaders = cacheValue.responseData.headers;
    var requestHeaders = request.headers;
    var varyValue = cacheResponseHeaders.vary;

    logger.log("Offline Persistence Toolkit OfflineCache: Processing HTTP Vary header");
    if (!varyValue) {
      return true;
    } else if (varyValue.trim() === '*') {
      return false;
    } else {
      var varyArray = varyValue.split(',');
      for (var index = 0; index < varyArray.length; index++) {
        var varyHeaderName = varyArray[index].toLowerCase();
        varyHeaderName = varyHeaderName.trim();
        var requestVaryHeaderValue = requestHeaders.get(varyHeaderName);
        var cachedRequestVaryHeaderValue = cacheRequestHeaders[varyHeaderName];
        logger.log("Offline Persistence Toolkit OfflineCache: HTTP Vary header name: " + varyHeaderName);
        logger.log("Offline Persistence Toolkit OfflineCache: Request HTTP Vary header value: " + requestVaryHeaderValue);
        logger.log("Offline Persistence Toolkit OfflineCache: Cached HTTP Vary header value: " + cachedRequestVaryHeaderValue);
        if ((!cachedRequestVaryHeaderValue && !requestVaryHeaderValue) ||
            (cachedRequestVaryHeaderValue && requestVaryHeaderValue &&
             cachedRequestVaryHeaderValue === requestVaryHeaderValue)) {
          continue;
        } else {
          return false;
        }
      }
    }

    return true;
  };

  /**
   * Convert the cached response data to Response object, it handles undefined
   * response data as well.
   * @param {Object} responseData Cached response data.
   * @param {Object} options options to control the behavior.
   * @param {boolean} options.ignoreBody default to false. If true, don't bother
   *                  building body from shredded data.
   * @returns {Promise} A promise that resolves to de-serialized Response object
   *                    from responseData. The promise is resolved to undefined
   *                    if responseData is undefined.
   */
  function _cacheEntryToResponse (request, responseData, options) {
    if (responseData) {
      logger.log("Offline Persistence Toolkit OfflineCache: Converting cached entry to Response object");
      var ignoreBody = false;
      if (options && options.ignoreBody) {
        ignoreBody = true;
      }
      var bodyAbstractText = responseData.bodyAbstract;

      return cacheHandler.constructResponse(responseData).then(function(response) {
        if (request.url != null && request.url.length > 0 &&
            response.headers.get('x-oracle-jscpt-response-url') == null) {
          response.headers.set('x-oracle-jscpt-response-url', request.url);
        }
        if (!ignoreBody && bodyAbstractText) {
          var bodyAbstract;
          try {
            bodyAbstract = JSON.parse(bodyAbstractText);
          } catch (exp) {
            logger.error("error parsing json " + bodyAbstractText);
          }
          return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
        } else {
          return response;
        }
      });
    } else {
      return Promise.resolve();
    }
  };

  function _cacheEntriesToResponses (request, responseDataArray, options) {
    if (!responseDataArray || !responseDataArray.length) {
      return Promise.resolve();
    } else {
      var promisesArray = responseDataArray.map(function (element) {
        return _cacheEntryToResponse(request, element, options);
      });
      return Promise.all(promisesArray);
    }
  };

  /**
   * Add the request/response pair into the cache.
   * @method
   * @name put
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request Request object of the pair
   * @param {Response} response Response object of the pair
   * @return {Promise} Returns a promise when the request/response pair is cached.
   */
  OfflineCache.prototype.put = function (request, response) {
    logger.log("Offline Persistence Toolkit OfflineCache: put() for Request with url: " + request.url);
    var self = this;
    var cacheKey;

    return self._getStore().then(function() {
      return cacheHandler.constructRequestResponseCacheData(request, response);
    }).then(function(requestResponsePair) {
      var cacheStore = self._store;
      cacheKey = requestResponsePair.key;
      var hasShredder = cacheHandler.hasShredder(request);
      if (!hasShredder) {
        return cacheStore.upsert(requestResponsePair.key,
                                 requestResponsePair.metadata,
                                 requestResponsePair.value);
      } else {
        return cacheHandler.shredResponse(request, response).then(function(shreddedPayload) {
          if (!shreddedPayload) {
            // something is wrong with the shredding process. will not cache
            // the request/response pair.
            cacheKey = null;
            return;
          }
          var storePromises = [];
          requestResponsePair.value.responseData.bodyAbstract = _buildBodyAbstract(shreddedPayload);
          storePromises.push(cacheStore.upsert(requestResponsePair.key,
                                               requestResponsePair.metadata,
                                               requestResponsePair.value));
          storePromises.push(cacheHandler.cacheShreddedData(shreddedPayload, requestResponsePair.metadata));

          return self._updateShreddedStoreNames(shreddedPayload.map(function(entry) {
            return entry.name;
          })).then(function() {
            return Promise.all(storePromises);
          });
        });
      }
    }).then(function() {
      if (cacheKey && self._cacheKeys.indexOf(cacheKey) < 0) {
        self._cacheKeys.push(cacheKey);
      }
    }).catch(function(error) {
      logger.error("error in cache.put() for Request with url: " + request.url);
    });
  };

  OfflineCache.prototype._updateShreddedStoreNames = function (storeNames) {
    return this._getShreddedNamesStore().then(function(store) {
      if (!storeNames) {
        return store.delete();
      } else {
        return store.keys().then(function(keys) {
          var keysToAdd = [];
          storeNames.forEach(function(storeName) {
            if (keys.indexOf(storeName) < 0) {
              keysToAdd.push(storeName);
            }
          });
          if (keysToAdd.length > 0) {
            var rowsToAdd = [];
            keysToAdd.forEach(function(key) {
              rowsToAdd.push({key: key, metadata: {}, value: {}});
            });
            return store.upsertAll(rowsToAdd);
          }
        });
      }
    });
  };

  OfflineCache.prototype._getShreddedStoreNames = function () {
    return this._getShreddedNamesStore().then(function(store) {
      return store.keys();
    });
  };

  function _buildBodyAbstract (shreddedPayload) {
    var bodyAbstract = shreddedPayload.map(function (element) {
      return {
        name: element.name,
        keys: element.keys ? element.keys.reduce(function(processedKeys, key) {
          if (key) {
            processedKeys.push(key);
          } else {
            logger.warn("should not have undefined key in the shredded data");
          }
          return processedKeys;
        }, []) : element.keys,
        resourceType: element.resourceType
      };
    });
    return JSON.stringify(bodyAbstract);
  };

  /**
   * Delete the all the entries in the cache that matches the passed-in request with
   * the specified options.
   * @method
   * @name delete
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promse} Finds the Cache entry whose key is the request, and if found,
   *                  deletes the Cache entry and returns a Promise that resolves to
   *                  true. If no Cache entry is found, it returns a Promise that
   *                  resolves to false.
   */
  OfflineCache.prototype.delete = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: delete() for Request with url: " + request.url);
    } else {
      logger.warn("Offline Persistence Toolkit OfflineCache: delete() request is a required parameter. To clear the cache, please call clear()");
      return Promise.resolve(false);
    }
    var self = this;

    return self._getStore().then(function(cacheStore) {
      if (cacheHandler.hasShredder(request)) {
        // shredder is configured for this request, needs to delete both
        // the cache entries and the shredded data entries.
        var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
        searchCriteria.fields = ['key', 'value'];
        var ignoreVary = (options && options.ignoreVary);
        return cacheStore.find(searchCriteria).then(function(dataArray) {
          if (dataArray && dataArray.length) {
            var filteredEntries = dataArray.filter(_filterByVary(ignoreVary, request, 'value'));
            var promises = [];
            filteredEntries.forEach(function(entry) {
              promises.push(cacheStore.removeByKey(entry.key));
              var index = self._cacheKeys.indexOf(entry.key);
              if (index >= 0) {
                self._cacheKeys.splice(index, 1);
              }
              if (entry.value.responseData.bodyAbstract && entry.value.responseData.bodyAbstract.length) {
                promises.push(cacheHandler.deleteShreddedData(JSON.parse(entry.value.responseData.bodyAbstract)));
              }
            });
            return Promise.all(promises).then(function() {
              logger.log("Offline Persistence Toolkit OfflineCache: all matching entries are deleted from both the cache store and the shredded store.");
              return true;
            })
          } else {
            return false;
          }
        });
      } else {
        // no shredder, deleting cache entries is sufficient.
        return _getStoreKeys(cacheStore, request, options).then(function(keysArray) {
          if (keysArray && keysArray.length) {
            var promisesArray = keysArray.map(function(key) {
              var index = self._cacheKeys.indexOf(key);
              if (index >= 0) {
                self._cacheKeys.splice(index, 1);
              }
              return cacheStore.removeByKey(key);
            });
            return Promise.all(promisesArray);
          } else {
            return [];
          }
        }).then(function(result) {
          if (result && result.length) {
            return true;
          } else {
            return false;
          }
        });
      }
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: error occurred delete() for Request with url: " + request.url);
      return false;
    });
  };

  /**
   * Retrieves all the keys in this cache.
   * @method
   * @name keys
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a promise that resolves to an array of Cache keys (which are Request objects).
   */
  OfflineCache.prototype.keys = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() for Request with url: " + request.url);
    } else {
      logger.log("Offline Persistence Toolkit OfflineCache: keys()");
    }
    var self = this;
    return self._getStore().then(function() {
      return _getStoreKeys(self._store, request, options);
    }).then(function(keysArray) {
      var requestsPromiseArray = [];
      keysArray.forEach(function(key) {
        requestsPromiseArray.push(self._store.findByKey(key).then(function(entry) {
          return persistenceUtils.requestFromJSON(entry.requestData);
        }));
      });
      return Promise.all(requestsPromiseArray);
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() error for Request with url: " + request.url);
      return [];
    });
  };

  function _getStoreKeys(store, request, options) {
    if (request) {
      // need to match with the passed-in request.
      var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
      searchCriteria.fields = ['key', 'value'];

      var ignoreVary = (options && options.ignoreVary);

      return store.find(searchCriteria).then(function (dataArray) {
        if (dataArray && dataArray.length) {
          var filteredEntries = dataArray.filter(_filterByVary(ignoreVary, request, 'value'));
          var keysArray = filteredEntries.map(function (entry) { return entry.key;});
          return keysArray;
        } else {
          return [];
        }
      });
    } else {
      // no passed-in request to match, so returns ALL requests objects in
      // the persistence store.
      return store.keys();
    }
  };

  /**
   * Checks if a match to this request with the specified options exist in the
   * cache or not. This is an optimization over match because we don't need to
   * query out the shredded data to fill the response body.
   * @method
   * @name hasMatch
   * @memberof! OfflineCache
   * @instance
   * @param {Request} request The request object to match against
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control the matching operation
   * <ul>
   * <li>options.ignoreSearch A Boolean that specifies whether to ignore
   *                          the query string in the url.  For example,
   *                          if set to true the ?value=bar part of
   *                          http://foo.com/?value=bar would be ignored
   *                          when performing a match. It defaults to false.</li>
   * <li>options.ignoreMethod A Boolean that, when set to true, prevents
   *                          matching operations from validating the
   *                          Request http method (normally only GET and
   *                          HEAD are allowed.) It defaults to false.</li>
   * <li>options.ignoreVary A Boolean that when set to true tells the
   *                          matching operation not to perform VARY header
   *                          matching — i.e. if the URL matches you will get
   *                          a match regardless of whether the Response
   *                          object has a VARY header. It defaults to false.</li>
   * </ul>
   * @return {Promise} Returns a promise that resolves to true if a match exist
   *                   while false otherwise.
   */
  OfflineCache.prototype.hasMatch = function (request, options) {
    logger.log("Offline Persistence Toolkit OfflineCache: hasMatch() for Request with url: " + request.url);
    var self = this;

    return self._getCacheEntries(request, options).then(function (cacheEntries) {
      var ignoreVary = (options && options.ignoreVary);
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return matchEntry !== null;
    });
  };

  /**
   * Clear the cache.
   * @method
   * @name clear
   * @memberof! OfflineCache
   * @instance
   * @return {Promise} Returns a promise that resolves to true when the cache is cleared.
   * Will resolve to false if not all cache items were able to be cleared.
   */
  OfflineCache.prototype.clear = function () {
    logger.log("Offline Persistence Toolkit OfflineCache: clear()");

    var self = this;
    return self._getStore().then(function(cacheStore) {
      var deletePromiseArray = [];
      deletePromiseArray.push(cacheStore.delete());
      return self._getShreddedStoreNames().then(function(storeNames) {
        storeNames.forEach(function(storeName) {
          deletePromiseArray.push(persistenceStoreManager.deleteStore(storeName));
          return;
        });
        return Promise.all(deletePromiseArray).then(function(results) {
          return self._updateShreddedStoreNames(null);
        }).then(function() {
          self._cacheKeys = [];
          return true;
        });
      });
    }).catch(function(error) {
      logger.log("Offline Persistence Toolkit OfflineCache: clear() error");
    });
  };

  return OfflineCache;
});
