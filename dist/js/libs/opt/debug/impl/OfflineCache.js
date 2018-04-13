/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(["./defaultCacheHandler", "./logger"], function (cacheHandler, logger) {
  'use strict';

  /**
   * OfflineCache module.
   * Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * In additional to functionalities provided by the standard Cache API, this
   * OfflineCache also interacts with shredding methods for more fine-grain
   * caching.
   * @module OfflineCache
   */

  /**
   * @export
   * @class OfflineCache
   * @classdesc  Persistence Toolkit implementation of the standard
   * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
   * @constructor
   * @param {String} name name of the cache
   * @param {Object} persistencestore instance for cache storage
   */
  function OfflineCache (name, persistencestore) {
    if (!name) {
      throw TypeError("A name must be provided to create an OfflineCache!");
    }
    if (!persistencestore) {
      throw TypeError("A persistence store must be provided to create an OfflineCache!");
    }

    this._name = name;
    this._store = persistencestore;
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
      var responseClone = response.clone();
      return self.put(request, response).then(function(){
        Promise.resolve(responseClone);
      })
    });
  };

  /**
   * Bulk operation of add.
   * @method
   * @name upsertAll
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

    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return self._store.find(searchCriteria).then(function (cacheEntries) {
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return _cacheEntryToResponse(matchEntry);
    }).then(function (results) {
      if (results) {
        var bodyAbstract = results[0];
        var response = results[1];
        return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
      } else {
        return Promise.resolve();
      }
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
    var self = this;

    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return  self._store.find(searchCriteria).then(function (cacheEntries) {
      var responseDataArray = _applyVaryForAllMatches(ignoreVary, request, cacheEntries);
      return _cacheEntriesToResponses(responseDataArray);
    }).then(function (responseArray) {
      if (responseArray && responseArray.length) {
        var promises = responseArray.map(function (responseElement) {
          var bodyAbstract = responseElement[0];
          var response = responseElement[1];
          return cacheHandler.fillResponseBodyWithShreddedData(request, bodyAbstract, response);
        });
        return Promise.all(promises);
      } else {
        return Promise.resolve([]);
      }
    });
  };

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
        if (_applyVaryCheck(ignoreVary, request, cacheEntry)) {
          return cacheEntry.responseData;
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
      var filteredArray = cacheEntries.filter(_filterByVary(ignoreVary, request));
      responseDataArray = filteredArray.map(function (entry) {return entry.responseData;});
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
   * @returns {Promise} A promise that resolves to de-serialized Response object
   *                    from responseData. The promise is resolved to undefined
   *                    if responseData is undefined.
   */
  function _cacheEntryToResponse (responseData) {
    if (responseData) {
      logger.log("Offline Persistence Toolkit OfflineCache: Converting cached entry to Response object");
      var promises = [];
      var bodyAbstract = responseData.bodyAbstract;
      if (bodyAbstract) {
        promises.push(Promise.resolve(JSON.parse(bodyAbstract)));
        delete responseData.bodyAbstract;
      } else {
        promises.push(Promise.resolve());
      }
      promises.push(cacheHandler.constructResponse(responseData));
      return Promise.all(promises);
    } else {
      return Promise.resolve();
    }
  };

  function _cacheEntriesToResponses (responseDataArray) {
    if (!responseDataArray || !responseDataArray.length) {
      return Promise.resolve();
    } else {
      var promisesArray = responseDataArray.map(function (element) {
        return _cacheEntryToResponse(element);
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
    var promises = [];
    promises.push(cacheHandler.constructRequestResponseCacheData(request, response));
    promises.push(cacheHandler.shredResponse(request, response));

    return Promise.all(promises).then(function (results) {
      var requestResponsePair = results[0];
      var shreddedPayload = results[1];
      if (!shreddedPayload) {
        // this is the case where no shredder/unshredder is specified.
        return self._store.upsert(requestResponsePair.key,
                                  requestResponsePair.metadata,
                                  requestResponsePair.value);
      } else {
        var storePromises = [];
        requestResponsePair.value.responseData.bodyAbstract = _buildBodyAbstract(shreddedPayload);
        storePromises.push(self._store.upsert(requestResponsePair.key,
                                              requestResponsePair.metadata,
                                              requestResponsePair.value));
        storePromises.push(cacheHandler.cacheShreddedData(shreddedPayload));
        return Promise.all(storePromises);
      }
    });
  };

  function _buildBodyAbstract (shreddedPayload) {
    var bodyAbstract = shreddedPayload.map(function (element) {
      return {
        name: element.name,
        keys: element.keys,
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
      logger.log("Offline Persistence Toolkit OfflineCache: delete()");
    }
    var self = this;

    return self.keys(request, options).then(function (keysArray) {
      if (keysArray && keysArray.length) {
        var promisesArray = keysArray.map(self._store.removeByKey, self._store);
        return Promise.all(promisesArray);
      } else {
        return false;
      }
    }).then(function (result) {
      if (result && result.length) {
        return true;
      } else {
        return false;
      }
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
   * @return {Promise} Returns a promise that resolves to an array of Cache keys.
   */
  OfflineCache.prototype.keys = function (request, options) {
    if (request) {
      logger.log("Offline Persistence Toolkit OfflineCache: keys() for Request with url: " + request.url);
    } else {
      logger.log("Offline Persistence Toolkit OfflineCache: keys()");
    }
    var self = this;

    if (request) {
      // need to match with the passed-in request.
      var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
      searchCriteria.fields = ['key', 'value'];

      var ignoreVary = (options && options.ignoreVary);

      return self._store.find(searchCriteria).then(function (dataArray) {
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
      return self._store.keys();
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
    var searchCriteria = cacheHandler.constructSearchCriteria(request, options);
    var ignoreVary = (options && options.ignoreVary);

    return self._store.find(searchCriteria).then(function (cacheEntries) {
      var matchEntry = _applyVaryForSingleMatch(ignoreVary, request, cacheEntries);
      return matchEntry !== null;
    });
  };

  return OfflineCache;
});