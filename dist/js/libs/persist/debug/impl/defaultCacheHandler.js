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
      var excludeBody = self.hasShredder(request);
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
      if (shreddedObjArray && Array.isArray(shreddedObjArray)) {
        return shreddedObjArray.map(_convertShreddedData);
      } else {
        return null;
      }
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

  // adds the shredded data into local shredded store.
  // shreddedObjArray:
  //  each item in this array corresponds to a shredded store:
  //    name: name of the store
  //    resourceType: single or collection
  //    resourceIdentifier: resource identifier
  //    keys: an array of key values
  //    data: an array of the data
  DefaultCacheHandler.prototype.cacheShreddedData = function(shreddedObjArray, requestMetadata) {
    logger.log("Offline Persistence Toolkit DefaultCacheHandler: cacheShreddedData()");
    var shreddedData = shreddedObjArray.map(_convertShreddedData);
    var self = this;
    return _updateShreddedDataStore(shreddedData).then(function() {
      if (self._isCompleteCollection(requestMetadata, shreddedObjArray)) {
        // this is a get request that returns the full collection,
        // then we need to remove shredded data that doesn't belong
        // in the list.
        return _removeStaleShreddedEntry(shreddedObjArray);
      }
    });
  };

  // check if the request is for a complete collection of a resource.
  // a complete collection request are those:
  // 1. must be a get/head request
  // 2. must return a collection type of response
  // 3.a if the request doesn't contain any query parameter, the response contains
  //      the complete list.
  // 3.b if the request contains "limit" query parameter, while the response
  //      contains the less than "limit" items, the response contains the full
  //      list.
  // 3.c if the request contains "offset" query parameter whose value is not 0,
  //     the respone is not a complete collection.
  DefaultCacheHandler.prototype._isCompleteCollection = function (requestMetadata, shreddedObjArray) {
    if (!requestMetadata ||
        (requestMetadata.method !== 'GET' && requestMetadata.method !== 'HEAD')) {
      return false;
    } else if (!_isCollectionResponse(shreddedObjArray)){
      return false;
    } else if (requestMetadata.url === requestMetadata.baseUrl) {
      return true;
    } else {
      var queryHandler = this._getQueryHandler(requestMetadata.url);
      if (!queryHandler || typeof queryHandler.normalizeQueryParameter !== 'function') {
        return false;
      }
      var queryParams = queryHandler.normalizeQueryParameter(requestMetadata.url);
      if (queryParams.searchCriteria || queryParams.offset !== 0) {
        return false;
      }
      var limit = queryParams.limit;
      if (limit < 0) {
        return true;
      }
      var rows = shreddedObjArray[0].keys.length;
      if (rows < limit) {
        return true;
      }
    }
    return false;
  }

  // check if the shredded data comes from a collection type of response
  function _isCollectionResponse(shreddedObjArray) {
    if (!shreddedObjArray) {
      return false;
    }
    for (var i = 0; i < shreddedObjArray.length; i++) {
      var storeData = shreddedObjArray[i];
      if (storeData.resourceType !== 'collection') {
        return false;
      }
    }
    return true;
  }

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

  // remove the stale entries from the shredded store, those entries
  // do not show up in the complete collection response from server,
  // we should replicate the deletion on client.
  function _removeStaleShreddedEntry(shreddedObjArray) {
    var promises = shreddedObjArray.map(function(element) {
      var storeName = element.name;
      var deleteExpression = {
        selector: {
          'key': {
            '$nin': element.keys
          }
        }
      };
      return persistenceStoreManager.openStore(storeName).then(function (store) {
        return store.delete(deleteExpression);
      });
    });
    return Promise.all(promises);
  };

  // helper function to convert entry of format
  // {
  //   name: store of the name
  //   resourceType: single or collection
  //   resourceIdentifier: etag
  //   keys: string[]
  //   data: object[]
  // }
  // into format
  // {
  //   storeName: [{
  //     key: keyValue,
  //     metadata: {lastUpdated: xx, resourceIdentifier: etag},
  //     value: {...}
  //   }, {...}]
  // }
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
    var key = request.url + "$" + request.method + "$";
    if (response) {
      var headers = response.headers;
      if (headers) {
        var varyValue = headers.get('vary');
        if (varyValue) {
          if (varyValue === '*') {
            // * vary value means every request is absolutely unique.
            key = (new Date()).getTime()*1000 + Math.floor(Math.random() * 1000);;  // @RandomNumberOK
          } else {
            var requestHeaders = request.headers;
            var varyFields = varyValue.split(',');
            for (var index = 0; index < varyFields.length; index++) {
              var varyField = varyFields[index];
              varyField = varyField.trim();
              var varyValue = (!requestHeaders || !requestHeaders.get(varyField)) ? 'undefined' : requestHeaders.get(varyField);
              key += varyField + '=' + varyValue + ';';
            }
          }
        }
      }
    }
    return key;
  };

  // request: the request to match against
  // options: options that controls the match
  // allKeys: the possible keys to find matches from.
  DefaultCacheHandler.prototype.getMatchedCacheKeys = function (request, options, allKeys) {
    var urlToMatch;
    var methodToMatch;

    if (options && options.ignoreSearch) {
      urlToMatch = extractBaseUrl(request.url);
    } else {
      urlToMatch = request.url;
    }
    if (!options || !options.ignoreMethod) {
      methodToMatch = request.method;
    }

    return allKeys.filter(function(key) {
      var parts = key.split("$");
      var urlToCheck;
      // check to see key was split into multiple parts based on delimiter
      if (parts.length === 1){
        // if only 1 part, then key may be using old key method
        // here for compatablity with pre v1.4.1

        // check if url to check is the same as the request url
        urlToCheck = key.slice(0,urlToMatch.length);
        if (urlToCheck !== urlToMatch) {
            return false;
        }

        if (options && options.ignoreSearch) {
          if (key[urlToMatch.length] === '/') {
            return false;
          }
        }
        // check the for the method using indexOf only if the method
        // needs to be matched. Slicing the key based on the length of the
        // urlToMatch length, if the option.ignoreSearch is true, we don't know
        // where the method is past the '?', so search the whole string. if
        // option.ignoreSearch is false, then just check the substring of method length
        var methodToCheck
        if (methodToMatch){
          if (options && options.ignoreSearch) {
            methodToCheck = key.slice(urlToMatch.length);
          } else {
            methodToCheck = key.slice(urlToMatch.length,urlToMatch.length + request.method.length)
          }
          if(methodToCheck.indexOf(methodToMatch) === -1) {
            return false;
          }
        }
        if (!options || !options.ignoreVary) {
          var variesInKey = key;
          // if methodToMatch exists, split based on method then select the last instance in the array for Vary
          // this is incase there are multiple instances of a method Keyword ie localhost.com/PUTherePUTVaryHeader
          if (methodToMatch){
            variesInKey = variesInKey.split(methodToMatch);
            variesInKey = variesInKey[variesInKey.length - 1];
          }
          else {
            // if method is ignored, using regular expressions to find the last instance of a method Keyword
            // return the capture group that appears after that keyword.
            variesInKey = getVariesRegExp(variesInKey);
          }
          if (!variesInKey) {
            return true;
          }

          // split based on = to determine number of keys
          var varyPairs = variesInKey.split('=')
          var requestHeaders = request.headers;
          // if only 2 items, then that is the header and value pair
          if (varyPairs === 2){
            var varyValue = (!requestHeaders || !requestHeaders.get(varyPairs[0])) ? 'undefined' : requestHeaders.get(varyPairs[0]);
            if (varyValue !== varyPairs[1]) {
              return false;
            }
          } else {
            // otherwise, the header and value pair of the next header are combined like 'str1=str2str3=str4”
            for (var index = 0; index < varyPairs.length - 1; index++) {
              var varyFieldValueToCheck = varyPairs[index];
              var varyValue = (!requestHeaders || !requestHeaders.get(varyFieldValueToCheck)) ? 'undefined' : requestHeaders.get(varyFieldValueToCheck);
              // split based on varyValue provided by the header
              var checkPairs = varyPairs[index+1].split(varyValue);
              // if value is in the header, it splits into length of 2, where the first item is ''
              if (checkPairs.length !== 2 && checkPairs[0] !== ''){
                return false;
              // must also check to make sure that the second pair does not start with a ',' otherwise
              // that means the vary value returned does not match the original value which contained more than 1 value
              }else if (checkPairs[1] && checkPairs[1].startsWith(',')){
                return false;
              } else {
                varyPairs[index+1] = checkPairs[1];
              }
            }
          }
        }
        return true
      } else {
        // use new key search
        if (options && options.ignoreSearch) {
          urlToCheck = extractBaseUrl(parts[0]);
        } else {
          urlToCheck = parts[0];
        }
        if (urlToCheck !== urlToMatch) {
          return false;
        }
        if (methodToMatch && parts[1] !== methodToMatch) {
          return false;
        }
        if (!options || !options.ignoreVary) {
          var variesInKey = parts[2];
          if (!variesInKey) {
            return true;
          }
          var pairs = variesInKey.split(';');
          if (pairs.length === 1) {
            return false;
          }
          var requestHeaders = request.headers;
          for (var index = 0; index < pairs.length - 1; index++) {
            var pair = pairs[index];
            var varyFieldValueToCheck = pair.split('=');
            var varyValue = (!requestHeaders || !requestHeaders.get(varyFieldValueToCheck[0])) ? 'undefined' : requestHeaders.get(varyFieldValueToCheck[0]);
            if (varyValue != varyFieldValueToCheck[1]) {
              return false;
            }
          }
        }
        return true;
      }
    });
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
    var baseUrl = extractBaseUrl(request.url);
    var metadata = {
      url:  request.url,
      method: request.method,
      baseUrl: baseUrl,
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
      return response;
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

    if (ignoreSearch) {
      var searchURL = extractBaseUrl(request.url);
      selectorField = {
        'metadata.baseUrl': searchURL
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
      sort: ['metadata.created']
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

  DefaultCacheHandler.prototype.hasShredder = function (request) {
     return (this._getShredder(request) !== null);
  };

  DefaultCacheHandler.prototype._getShredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request.url);
    return jsonProcessor ? jsonProcessor.shredder : null;
  };

  DefaultCacheHandler.prototype._getUnshredder = function (request) {
    var jsonProcessor = this._getJsonProcessor(request.url);
    return jsonProcessor ? jsonProcessor.unshredder : null;
  };

  DefaultCacheHandler.prototype._getJsonProcessor = function (requestUrl) {
    var allKeys = Object.keys(this._endpointToOptionsMap);
    for (var index = 0; index < allKeys.length; index++) {
      var key = allKeys[index];
      if (requestUrl === JSON.parse(key).url) {
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

  DefaultCacheHandler.prototype._getQueryHandler = function (requestUrl) {
    var allKeys = Object.keys(this._endpointToOptionsMap);
    for (var index = 0; index < allKeys.length; index++) {
      var key = allKeys[index];
      if (requestUrl === JSON.parse(key).url) {
        var option = this._endpointToOptionsMap[key];
        if (option && option.queryHandler) {
          return option.queryHandler;
        } else {
          return null;
        }
      }
    }
    return null;
  }

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
    if (bodyAbstract && bodyAbstract.length === 1) {
      if (bodyAbstract[0].resourceType === 'single') {
        response.headers.set('x-oracle-jscpt-resource-type', 'single');
      }
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
            return {key: {$eq: keyValue}};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.find(findExpression);
        }
      }
      return [];
    }).then(function (results) {
      if (!Array.isArray(results)) {
        results = [results];
      }
      storeEntry.data = results;
      return storeEntry;
    });
  };

  /**
   * Utility method that deletes the shredded data identified by
   * the body-less resonse.
   * @method
   * @name deleteShreddedData
   * @memberof! DefaultCacheHandler
   * @instance
   * @param {bodyAbstract} request The body abstract from the cached body-less
   *                               response.
   * @return {Promise} returns a Promise that resolve when all the shredded
   *                   data is deleted.
   */
  DefaultCacheHandler.prototype.deleteShreddedData = function (bodyAbstract) {
    var promises = [];
    bodyAbstract.forEach(function(item) {
      var storeName = item.name;
      var keys = item.keys;
      if (storeName && keys && keys.length) {
        var storeDeletionTask = persistenceStoreManager.openStore(storeName).then(function(store) {
          var transformedKeys = keys.map(function (keyValue) {
            return {key: {$eq: keyValue}};
          });
          var findExpression = {
            selector: {
              $or: transformedKeys
            }
          };
          return store.delete(findExpression);
        });
        promises.push(storeDeletionTask);
      }
    });
    return Promise.all(promises);
  };

  var escapeRegExp = function(str) {
    return String(str).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
  };

  var extractBaseUrl = function(fullUrl) {
    // return the url that doesn't have query parameters in it.
    if (!fullUrl || typeof fullUrl !== 'string') {
      return "";
    }
    var pattern = /([^?]*)\?/;
    var matchResult = pattern.exec(fullUrl);
    if (matchResult && matchResult.length === 2) {
      return matchResult[1];
    } else {
      return fullUrl;
    }
  };
  var getVariesRegExp = function(fullUrl) {
    // returns the Vary section of a if the option ignore method is applied
    // regexp is in reversed strings with '.*?' to capture as little as possible
    // before hitting the first instance of a method String.
    if (!fullUrl || typeof fullUrl !== 'string') {
      return "";
    }
    var reversedUrl = fullUrl.split("").reverse().join("")
    var pattern = /(.*?)(TEG|TUP|ETELED|TSOP|HCTAP|TCENNOC|SNOITPO|ECART)/;
    var matchResult = pattern.exec(reversedUrl);
    if (matchResult && matchResult.length === 3) {
      return matchResult[1].split("").reverse().join("");
    } else {
      return fullUrl;
    }
  };

  return new DefaultCacheHandler();
});
