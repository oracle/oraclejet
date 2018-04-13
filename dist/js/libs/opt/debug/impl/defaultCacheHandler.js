/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['../persistenceUtils', '../persistenceStoreManager', './logger'],
  function (persistenceUtils, persistenceStoreManager, logger) {
  'use strict';

  /**
   * defaultCacheHandler module.
   * This serves as a bridge between {@link OfflineCache} and
   * {@link PersistenceStore}. It contains utility methods to convert Request
   * / Response into/from the structure that's suitable to put into the
   * persistence store.
   * @module defaultCacheHandler
   */

  /**
   * @class DefaultCacheHandler
   * @classdesc DefaultCacheHandler constructor
   * @constructor
   */
  function DefaultCacheHandler() {
    Object.defineProperty(this, '_endpointToOptionsMap', {
      value: {},
      writable: true
    });
  }

  /**
   * Utility method that constructs data out from the request/response pair
   * that can be persisted into our storage. For request/response from the
   * scope that has shredder/unshredder configured, we will only save the
   * shredded response, thus the response persisted in offline cache will be
   * body-less. The body will be pulled out from shredded store as needed.
   * @method
   * @name constructRequestResponseCacheData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object to construct data out from.
   * @param {Response} response The response object to contruct data out from
   * @return {Promise} returns a Promise that resolves to JS object out from
   *                           the request/response pair that can be persisted
   *                           into our storage.
   */
  DefaultCacheHandler.prototype.constructRequestResponseCacheData = function (request, response) {
    var self = this;
    var dataField = {};
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructRequestResponseCacheData()");
    return persistenceUtils.requestToJSON(request).then(function(requestJSONData){
      dataField.requestData = requestJSONData;
      // cache the body-less response if shredder/unshreder is configured
      // for this request. cache the full response otherwise.
      var excludeBody = self._excludeBody(request);
      return persistenceUtils.responseToJSON(response, {excludeBody: excludeBody});
    }).then(function (responseJSONData) {
      dataField.responseData = responseJSONData;
      return {
        key: self._constructCacheKey(request, response),
        metadata: self.constructMetadata(request),
        value: dataField
      };
    });
  };

  /**
   * Utility method that uses the configured JSON processor to shred response
   * payload and constructs shredded data into structure that can be persisted
   * into storage for later.
   * @method
   * @name constructShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Response} response The response object whose payload is used to
   *                            contruct shredded data out from.
   * @param {Object} options Options where shredder is retrieved from.
   * @return {Promise} returns a Promise that resolves to undefined if there is
   *                           no need to persist shredded data. This happens
   *                           when no json processor is provided. It resolves
   *                           to an array of data that needs to be stored. Each
   *                           item has the structure of
   *                           {storename: [{key, metadata, value}]}.
   */
  DefaultCacheHandler.prototype.constructShreddedData = function (request, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructShreddedData()");
    var shredder = this._getShredder(request);

    if (!shredder) {
      return Promise.resolve();
    }

    return  shredder(response).then(function (shreddedObjArray) {
      var shreddedData = shreddedObjArray.map(_convertShreddedData);
      return Promise.resolve(shreddedData);
    });
  };

  DefaultCacheHandler.prototype.shredResponse = function (request, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: shredResponse()");
    var shredder = this._getShredder(request);

    if (!shredder) {
      return Promise.resolve();
    }

    return shredder(response);
  };

  DefaultCacheHandler.prototype.cacheShreddedData = function(shreddedObjArray) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: cacheShreddedData()");
    var shreddedData = shreddedObjArray.map(_convertShreddedData);
    return _updateShreddedDataStore(shreddedData);
  };

  // helper function to convert array where each element of format
  // into array where each
  //
  function _updateShreddedDataStore(shreddedData) {
    var promises = shreddedData.map(function (element) {
      var storeName = Object.keys(element)[0];
      var storeData = element[storeName];
      if (!storeData || !storeData.length) {
        return Promise.resolve();
      }
      return _updateShreddedDataForStore(storeName, storeData);
    });
    return Promise.all(promises);
  };

  function _updateShreddedDataForStore(storeName, storeData) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: Updating store with shredded data");
    return  persistenceStoreManager.openStore(storeName).then(function (store) {
      return store.upsertAll(storeData);
    });
  };

  // helper function to convert entry of format
  // {}
  // into format
  function _convertShreddedData (entry) {
    var storeName = entry.name;
    var resourceIdentifierValue = entry.resourceIdentifier;
    var ids = entry.keys;
    var shreddedDataArray = [];
    var currentTime = (new Date()).toUTCString();
    for (var i = 0; i < ids.length; i++) {
      var data = {
        key: ids[i],
        metadata: {
          lastUpdated: currentTime,
          resourceIdentifier: resourceIdentifierValue,
        },
        value: entry.data[i]
      };
      shreddedDataArray.push(data);
    }
    var convertedEntry = {};
    convertedEntry[storeName] = shreddedDataArray;
    return convertedEntry;
  };

  /**
   * Utility method that constructs a unique cache entry key for the
   * request/response pair to be persisted into our storage.
   * @method
   * @name _constructCacheKey
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object from which to generate cache
   *                          entry key.
   * @param {Response} response The response object from which to generate cache
   *                          entry key.
   * @return {String} returns a string that can be used as a key to persist
   *                          this request into the storage.
   */
  DefaultCacheHandler.prototype._constructCacheKey = function (request, response) {
    var key = request.url + request.method;
    if (response) {
      var headers = response.headers;
      if (headers) {
        var varyValue = headers.get('vary');
        if (varyValue) {
          if (varyValue === '*') {
            // * vary value means every request is absolutely unique.
            key += (new Date()).getTime();
          } else {
            var requestHeaders = request.headers;
            var varyFields = varyValue.split(',');
            for (var index = 0; index < varyFields.length; index++) {
              var varyField = varyFields[index];
              var varyValue = requestHeaders ? requestHeaders.get(varyField) : 'undefined';
              key += varyField + '=' + varyValue;
            }
          }
        }
      }
    }
    return key;
  };

  /**
   * Utility method that constructs metadata for the request to be used
   * to be persisted into our storage.
   * @method
   * @name constructMetadata
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object to construct metadata for.
   * @return {String} returns a JS object that can be used as metadata to
   *                          persist this request into the storage.
   */
  DefaultCacheHandler.prototype.constructMetadata = function (request) {
    var currentTime = (new Date()).getTime();
    var metadata = {
      url:  request.url,
      method: request.method,
      created: currentTime,
      lastupdated: currentTime
    };
    return metadata;
  };

  /**
   * Utility method that constructs a Response object out from the persisted
   * data.
   * @method
   * @name constructResponse
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Object} data The persisted response data from storage.
   * @return {Promise} returns a Promise that resolves to a Response object
   *                           out from the persisted data.
   */
  DefaultCacheHandler.prototype.constructResponse = function (data) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructResponse()");
    return  persistenceUtils.responseFromJSON(data).then(function (response) {
      if (!persistenceUtils.isCachedResponse(response)) {
        // this means the cached response data does not contain the header
        // 'x-oracle-jscpt-cache-expiration-date'. We still to add it with
        // empty value then to denote this is a cached Response
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
      }
      return Promise.resolve(response);
    });
  };

  /**
   * Utility method that constructs search criteria in Mango-db style based on
   * the provided match options.
   * @method
   * @name constructSearchCriteria
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request object based on which to generate
   *                          search criteria.
   * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}} options Options to control generating search criteria.
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
   * @return {Promise} returns a Promise that resolves to Mango-db style search
   *                           expressions to query out cached request/response.
   */
  DefaultCacheHandler.prototype.constructSearchCriteria = function (request, options) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: constructSearchCriteria()");
    var ignoreSearch = false;
    if (options && options.ignoreSearch !== undefined) {
      ignoreSearch = options.ignoreSearch;
    }

    var ignoreMethod = false;
    if (options && options.ignoreMethod !== undefined) {
      ignoreMethod = options.ignoreMethod;
    }

    var selectorField;
    var searchURL;

    var searchStartIndex = request.url.indexOf('?');
    if (searchStartIndex >= 0) {
      searchURL = request.url.substring(0, searchStartIndex);
    } else {
      searchURL = request.url;
    }

    if (ignoreSearch) {
      selectorField = {
        'metadata.url': {
          '$regex': '^' + escapeRegExp(searchURL) + '(\\?|$)'
        }
      };
    } else {
      selectorField = {
        'metadata.url' : request.url
      }
    }

    if (!ignoreMethod) {
      selectorField['metadata.method'] = request.method;
    }

    var searchCriteria = {
      selector: selectorField,
      sort: [{'metadata.created' : 'asc'}]
    };

    return searchCriteria;
  };

  /**
   * Register options (jsonProcessor, including shredder and unshredder) under
   * an endpoint key. This is to facilitate how response is cached. For response
   * to scope that has shredder/unshredder, the response body will be persisted
   * in the shredded store, cache enty will only contain the bodyless response.
   * For responses that don't have corresponding jsonProcessor, the full response
   * body will be cached.
   * @method
   * @name registerEndpointOptions
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {object} endpointKey The object that contains the request url to
   *                 look up shredding/unshredding options. An object is used
   *                 as key so we can unregister the endpoint when a request
   *                 is finished processing.
   * @param {{jsonProcessor: object}} processor jsonProcessor associated with
   *                                  the endpointKey.
   */
  DefaultCacheHandler.prototype.registerEndpointOptions = function (endpointKey, options) {
    if (!endpointKey) {
      throw new Error({message: 'a valid endpointKey must be provided.'});
    }

    if (this._endpointToOptionsMap[endpointKey]) {
      throw new Error({message: 'endpointKey can only be registered once.'});
    }

    this._endpointToOptionsMap[endpointKey] = options;
  };

  DefaultCacheHandler.prototype.unregisterEndpointOptions = function (endpointKey) {
    if (!endpointKey) {
      throw new Error({message: 'a valid endpointKey must be provided.'});
    }
    delete this._endpointToOptionsMap[endpointKey];
  };

  DefaultCacheHandler.prototype._excludeBody = function (request) {
     return (this._getShredder(request) !== null);
  };

  DefaultCacheHandler.prototype._getShredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request);
    return jsonProcessor ? jsonProcessor.shredder : null;
  };

  DefaultCacheHandler.prototype._getUnshredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request);
    return jsonProcessor ? jsonProcessor.unshredder : null;
  };

  DefaultCacheHandler.prototype._getJsonProcessor = function (request) {
    var allKeys = Object.keys(this._endpointToOptionsMap);
    for (var index = 0; index < allKeys.length; index++) {
      var key = allKeys[index];
      if (request.url === JSON.parse(key).url) {
        var option = this._endpointToOptionsMap[key];
        if (option && option.jsonProcessor &&
            option.jsonProcessor.shredder &&
            option.jsonProcessor.unshredder) {
          return option.jsonProcessor;
        } else {
          return null;
        }
      }
    }
    return null;
  };

  /**
   * Utility method that fill the body-less response with data queried from
   * shredded data stores.
   * @method
   * @name fillResponseBodyWithShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {Request} request The request of the request/response pair.
   * @param {Response} response The bodyless response of the request/response pair.
   * @return {Promise} returns a Promise that resolves to the response whose body
   *                   is filled with content from shredded store.
   */
  DefaultCacheHandler.prototype.fillResponseBodyWithShreddedData = function (request, bodyAbstract, response) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: fillResponseBodyWithShreddedData()");
    if (request.url != null &&
      request.url.length > 0 &&
      response.headers.get('x-oracle-jscpt-response-url') == null) {
      response.headers.set('x-oracle-jscpt-response-url', request.url);
    }
    var unshredder = this._getUnshredder(request);
    var shredder = this._getShredder(request);
    if (!unshredder || !shredder || !response || !bodyAbstract || !bodyAbstract.length) {
      return Promise.resolve(response);
    }

    var promises = bodyAbstract.map(function (element) {
      return _fillStoreValue(element);
    });

    return Promise.all(promises).then(function (results) {
      return unshredder(results, response);
    });
  };

  function _fillStoreValue(storeEntry) {
    var storeName = storeEntry.name;

    return  persistenceStoreManager.openStore(storeName).then(function (store) {
      if (storeEntry.keys && storeEntry.keys.length) {
        if (storeEntry.keys.length === 1) {
          return store.findByKey(storeEntry.keys[0]);
        } else {
          var transformedKeys = storeEntry.keys.map(function (keyValue) {
            return {key: keyValue};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.find(findExpression);
        }
      }
      return Promise.resolve([]);
    }).then(function (results) {
      if (!Array.isArray(results)) {
        results = [results];
      }
      storeEntry.data = results;
      return Promise.resolve(storeEntry);
    });
  };

  var escapeRegExp = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  return new DefaultCacheHandler();
});
