/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('fetchStrategies',['./persistenceManager', './persistenceUtils', './impl/defaultCacheHandler','./impl/logger'],
  function (persistenceManager, persistenceUtils, cacheHandler, logger) {
    'use strict';

    /**
     * @class fetchStrategies
     * @classdesc Contains out of the box Fetch Strategies which includes Cache First
     * and Cache If Offline fetch strategies.
     *
     * The Cache First strategy always fetches
     * from the local cache first regardless of offline status and returns the
     * cached response. In addition, when online, a fetch is also made out to the server
     * and the serverResponseCallback (if supplied) is called with the server response.
     *
     * The Cache If Offline strategy will fetch from the server when online and will
     * fetch from the cache if offline.
     * @export
     * @hideconstructor
     */

    /**
     * Returns the Cache First fetch strategy
     * @method
     * @name getCacheFirstStrategy
     * @memberof fetchStrategies
     * @static
     * @param {{serverResponseCallback: Function}=} options Options
     * <ul>
     * <li>options.serverResponseCallback The callback which will be called when the server responds. The callback should return a Promise which resolves when complete.</li>
     * <li>options.backgroundFetch Whether to do background fetching to the server when online. 'disabled' will disable background fetching, 'enabled' will enable it. The default is 'enabled'.</li>
     * </ul>
     * @return {Function} Returns the Cache First fetch strategy which conforms
     * to the Fetch Strategy API.
     */
    function getCacheFirstStrategy(options) {
      options = options || {};
      var serverResponseCallback = options['serverResponseCallback'];
      var backgroundFetch = options['backgroundFetch'];
      var isBackgroundFetchDisabled = backgroundFetch == 'disabled' ? true : false;
      
      if (isBackgroundFetchDisabled) {
        serverResponseCallback = null;
      }
      
      if (!serverResponseCallback && !isBackgroundFetchDisabled) {
        // dummy callback just so that the local cache is updated
        serverResponseCallback = function(request, response) {
          return Promise.resolve(response);
        };
      }

      return function (request, options) {
        logger.log("Offline Persistence Toolkit fetchStrategies: Processing CacheFirstStrategy");
        if (serverResponseCallback) {
          var wrappedServerResponseCallback = function (request, response) {
            var endpointKey = persistenceUtils.buildEndpointKey(request);
            cacheHandler.registerEndpointOptions(endpointKey, options);
            var localVars = {};
            return persistenceUtils._cloneResponse(response, {url: request.url}).then(function(responseClone) {
              return serverResponseCallback(request, responseClone);
            }).then(function (resolvedResponse) {
              localVars.resolvedResponse = resolvedResponse;
              return persistenceManager.getCache().hasMatch(request, {ignoreSearch: true});
            }).then(function (matchExist) {
              var responseClone = localVars.resolvedResponse.clone();
              if (matchExist) {
                if (localVars.resolvedResponse != null &&
                  !persistenceUtils.isCachedResponse(localVars.resolvedResponse) &&
                  (request.method == 'GET' ||
                    request.method == 'HEAD')) {
                  return persistenceManager.getCache().put(request, localVars.resolvedResponse).then(function () {
                    return responseClone;
                  });
                } else {
                  return responseClone;
                }
              } else {
                return responseClone;
              }
            }).then(function (response) {
              cacheHandler.unregisterEndpointOptions(endpointKey);
              return Promise.resolve(response);
            });
          }
        }
        return _fetchFromCacheOrServerIfEmpty(request, options, wrappedServerResponseCallback);
      };
    };

    /**
     * Returns the Cache If Offline Fetch Strategy
     * @method
     * @name getCacheIfOfflineStrategy
     * @memberof fetchStrategies
     * @static
     * @return {Function} Returns the Cache If Offline fetch strategy which conforms
     * to the Fetch Strategy API.
     */
    function getCacheIfOfflineStrategy() {
      return function (request, options) {
        logger.log("Offline Persistence Toolkit fetchStrategies: Processing CacheIfOfflineStrategy");
        if (persistenceManager.isOnline()) {
          return persistenceManager.browserFetch(request).then(function (response) {
            // check for response.ok. That indicates HTTP status in the 200-299 range
            if (response.ok) {
              return persistenceUtils._cloneResponse(response, {url: request.url});
            } else {
              return _handleResponseNotOk(request, response, options);
            }
          }, function (err) {
            // As per MDN, fetch will reject when there is a network error
            // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
            // in that case we do want to fetch from cache.
            logger.log(err);
            return _fetchFromCacheOrServerIfEmpty(request, options);
          });
        } else {
          return _fetchFromCacheOrServerIfEmpty(request, options);
        }
      }
    };

    function _handleResponseNotOk(request, response, options) {
      // for 300-499 range, we should not fetch from cache.
      // 300-399 are redirect errors
      // 400-499 are client errors which should be handled by the client
      if (response.status < 500) {
        logger.log("Offline Persistence Toolkit fetchStrategies: Response is not ok");
        return Promise.resolve(response);
      } else {
        // 500-599 are server errors so we can fetch from cache
        return _fetchFromCacheOrServerIfEmpty(request, options);
      }
    };

    function _checkCacheForMatch(request) {
      return persistenceManager.getCache().match(request, {ignoreSearch: true});
    };

    function _fetchFromCacheOrServerIfEmpty(request, options, serverResponseCallback) {
      return new Promise(function (resolve, reject) {
        logger.log("Offline Persistence Toolkit fetchStrategies: Process queryParams for Request");
        _processQueryParams(request, options).then(function (queryResponse) {
          if (!queryResponse) {
            logger.log("Offline Persistence Toolkit fetchStrategies: Response for queryParams is not null");
            _checkCacheForMatch(request).then(function (cachedResponse) {
              if (cachedResponse) {
                logger.log("Offline Persistence Toolkit fetchStrategies: Cached Response is not null");
                resolve(cachedResponse);
                _fetchForServerResponseCallback(request, serverResponseCallback);
              } else {
                logger.log("Offline Persistence Toolkit fetchStrategies: Cached Response is null");
                persistenceManager.browserFetch(request).then(function (response) {
                  var responseClone = response.clone();
                  resolve(responseClone);

                  if (serverResponseCallback) {
                    serverResponseCallback(request, response);
                  }
                  return;
                }, function (err) {
                  var init = {'status': 503, 'statusText': 'No cached response exists'};
                  resolve(new Response(null, init));
                });
              }
            });
          } else {
            resolve(queryResponse.clone());
            _fetchForServerResponseCallback(request, serverResponseCallback);
          }
        });
      });
    };

    function _fetchForServerResponseCallback(request, serverResponseCallback) {
      if (serverResponseCallback) {
        // we don't need to do any error handling.
        // At this point we've already resolved with a response.
        // This fetch is only for the server response callback which
        // may not occur if there is no connectivity or some other issue.
        logger.log("Offline Persistence Toolkit fetchStrategies: Fetch for ServerResponseCallback");
        persistenceManager.browserFetch(request).then(function (response) {
          persistenceUtils._cloneResponse(response, {url: request.url}).then(function(responseClone) {
            serverResponseCallback(request, responseClone);
          });
        });
      }
    };

    function _processQueryParams(request, options) {
      // this is a helper function for processing URL query params
      var queryHandler = _getQueryHandler(options);

      if (queryHandler == null) {
        // if a queryHandler was not specified
        return Promise.resolve();
      } else {
        return queryHandler(request, options);
      }
    };

    function _getQueryHandler(options) {
      // this is a helper function for processing URL query params
      var queryHandler = null;

      if (options['queryHandler'] != null) {
        queryHandler = options['queryHandler'];
      }

      return queryHandler;
    };

    return {'getCacheFirstStrategy': getCacheFirstStrategy,
      'getCacheIfOfflineStrategy': getCacheIfOfflineStrategy};
  });


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('cacheStrategies',['./persistenceManager', './persistenceUtils', './impl/logger'], function (persistenceManager, persistenceUtils, logger) {
  'use strict';
  
  /**
   * @class cacheStrategies
   * @classdesc Contains out of the box Cache Strategies which includes the HTTP Cache Header
   * strategy. The cache strategy is applied to GET/HEAD requests by the defaultResponseProxy right after the
   * fetch strategy is applied and the response is obtained. The cache strategy should be
   * a function which takes the request and response as parameter and returns a Promise
   * which resolves to the response. In the case the fetch strategy returns a server response.
   * the cache strategy should determine whether the request/response should be cached
   * and if so, persist the request/response by calling persistenceManager.getCache().put(). The
   * cache strategy should also handle cached responses returned by the fetch strategy.
   * @export
   * @hideconstructor
   */
  
  /**
   * Returns the HTTP Cache Header strategy
   * @method
   * @name getHttpCacheHeaderStrategy
   * @memberof cacheStrategies
   * @static
   * @return {Function} Returns the HTTP Cache Header strategy which conforms
   * to the Cache Strategy API.
   */
  function getHttpCacheHeaderStrategy() {
    return function (request, response) {
      // process the headers in order. Order matters, you want to
      // do things like re-validation before you bother persist to
      // the cache. Also, max-age takes precedence over Expires.
      return _handleExpires(request, response).then(function (response) {
        return _handleMaxAge(request, response);
      }).then(function (response) {
        return _handleIfCondMatch(request, response);
      }).then(function (response) {
        return _handleMustRevalidate(request, response);
      }).then(function (response) {
        return _handleNoCache(request, response);
      }).then(function (response) {
        return _handleNoStore(request, response);
      });
    };
  };
  
  function _handleExpires(request, response) {
    // expires header - Contains a UTC Datetime value
    // which can be used to directly populate x-oracle-jscpt-cache-expiration-date
    // if x-oracle-jscpt-cache-expiration-date is already populated then that wins
    var expiresDate = response.headers.get('Expires');
    var cacheExpirationDate = response.headers.get('x-oracle-jscpt-cache-expiration-date');
    
    if (expiresDate &&
      persistenceUtils.isCachedResponse(response) &&
      (!cacheExpirationDate || cacheExpirationDate.length == 0)) {
      response.headers.set('x-oracle-jscpt-cache-expiration-date', expiresDate);
      logger.log("Offline Persistence Toolkit cacheStrategies: Set x-oracle-jscpt-cache-expiration-date header based on HTTP Expires header");
    }
    return Promise.resolve(response);
  };
  
  function _handleMaxAge(request, response) {
    // max-age cache header - Use it to calculate and populate cacheExpirationDate.
    // Takes precendence over Expires so should be called after processing Expires.
    // Also, unlike  Expires it's relative to the Date of the request
    var cacheControlMaxAge = _getCacheControlDirective(response.headers, 'max-age');

    if (cacheControlMaxAge != null) {
      if (persistenceUtils.isCachedResponse(response)) {
        var requestDate = request.headers.get('Date');
        if (!requestDate) {
          requestDate = (new Date()).toUTCString();
        }
        var requestTime = (new Date(requestDate)).getTime();
        var expirationTime = requestTime + 1000 * cacheControlMaxAge;
        var expirationDate = new Date(expirationTime);
        response.headers.set('x-oracle-jscpt-cache-expiration-date', expirationDate.toUTCString());
        logger.log("Offline Persistence Toolkit cacheStrategies: Set x-oracle-jscpt-cache-expiration-date header based on HTTP max-age header");
      }
    }
    return Promise.resolve(response);
  };
  
  function _handleIfCondMatch(request, response) {
    // If-Match or If-None-Match headers
    var ifMatch = request.headers.get('If-Match');
    var ifNoneMatch = request.headers.get('If-None-Match');
    
    if (ifMatch || ifNoneMatch) {
      if (!persistenceManager.isOnline()) {
        var etag = response.headers.get('ETag');

        if (ifMatch &&
          etag.indexOf(ifMatch) < 0) {
          // If we are offline then we MUST return 412 if no match as per
          // spec
          return persistenceUtils.responseToJSON(response).then(function (responseData) {
            responseData.status = 412;
            responseData.statusText = 'If-Match failed due to no matching ETag while offline';
            logger.log("Offline Persistence Toolkit cacheStrategies: Returning Response status 412 based on ETag and HTTP If-Match header");
            return persistenceUtils.responseFromJSON(responseData);
          });
        } else if (ifNoneMatch &&
          etag.indexOf(ifNoneMatch) >= 0) {
          // If we are offline then we MUST return 412 if match as per
          // spec
          return persistenceUtils.responseToJSON(response).then(function (responseData) {
            responseData.status = 412;
            responseData.statusText = 'If-None-Match failed due to matching ETag while offline';
            logger.log("Offline Persistence Toolkit cacheStrategies: Returning Response status 412 based on ETag and HTTP If-None-Match header");
            return persistenceUtils.responseFromJSON(responseData);
          });
        }
      } else {
        // If we are online then we have to revalidate
        return _handleRevalidate(request, response, false);
      }
    }
    return Promise.resolve(response);
  };
  
  function _handleMustRevalidate(request, response) {
    // must-revalidate MUST revalidate stale info. If we're offline or
    // server cannot be reached then client MUST return a 504 error:
    // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html
    var mustRevalidate = _getCacheControlDirective(response.headers, 'must-revalidate');
    if (mustRevalidate) {
      var cacheExpirationDate = response.headers.get('x-oracle-jscpt-cache-expiration-date');
      if (cacheExpirationDate) {
        var cacheExpirationTime = (new Date(cacheExpirationDate)).getTime();
        var currentTime = (new Date()).getTime();

        if (currentTime > cacheExpirationTime) {
          logger.log("Offline Persistence Toolkit cacheStrategies: Handling revalidation HTTP must-revalidate header");
          return _handleRevalidate(request, response, true);
        }
      }
    }
    return Promise.resolve(response);
  };
  
  function _handleNoCache(request, response) {
    if (!_isNoCache(request, response)) {
      return Promise.resolve(response);
    } else {
      // no-cache must always revalidate
      return _handleRevalidate(request, response);
    }
  };
  
  function _isNoCache(request, response) {
    if (_getCacheControlDirective(response.headers, 'no-cache')) {
      logger.log("Offline Persistence Toolkit cacheStrategies: Has HTTP no-cache header");
      return true;
    }
    // pragma: no-cache in the request header has the same effect
    var pragmaNoCache = request.headers.get('Pragma');
    var isPragmeNoCache = pragmaNoCache && (pragmaNoCache.trim() === 'no-cache');
    
    if (isPragmeNoCache) {
      logger.log("Offline Persistence Toolkit cacheStrategies: Has HTTP Pragma no-cache header");
    }
    return isPragmeNoCache;
  };
  
  function _handleNoStore(request, response) {
    // no-store is the only one which can prevent storage in the cache
    // so have it control the cacheResponse call
    var noStore = _getCacheControlDirective(response.headers, 'no-store');

    if (noStore != null) {
      // remove the header if we're not going to store in the cache
      if (persistenceUtils.isCachedResponse(response)) {
        response.headers.delete('x-oracle-jscpt-cache-expiration-date');
      }
      logger.log("Offline Persistence Toolkit cacheStrategies: Has HTTP no-store header");
      return Promise.resolve(response);
    } else {
      return _cacheResponse(request, response);
    }
  };
  
  function _getCacheControlDirective(headers, directive) {
    // Retrieve the Cache-Control headers and parse
    var cacheControl = headers.get('Cache-Control');

    if (cacheControl) {
      var cacheControlValues = cacheControl.split(',');

      var i;
      var cacheControlVal;
      var splitVal;
      for (i = 0; i < cacheControlValues.length; i++) {
        cacheControlVal = cacheControlValues[i].trim();
        // we only care about cache-control values which
        // start with the directive
        if (cacheControlVal.indexOf(directive) === 0) {
          splitVal = cacheControlVal.split('=');
          return (splitVal.length > 1) ?
            splitVal[1].trim() :
            true;
        }
      }
    }

    return null;
  };

  function _handleRevalidate(request, response, mustRevalidate) {
    // If we are offline, we can't revalidate so just return the cached response
    // unless mustRevalidate is true, in which case reject with error.
    // If we are online then if the response is a cached Response, we need to
    // revalidate. If the revalidation returns 304 then we can just return the
    // cached version
    // _handleRevalidate can be called multiple times due to different cache
    // headers requiring it however a server call will, if needed, only be made
    // once because after that we will have a server response and any subsequent
    // _handleRevalidate calls will just resolve.
    if (persistenceUtils.isCachedResponse(response)) {
      if (!persistenceManager.isOnline()) {
        // If we must revalidate then we MUST return a 504 when offline
        // https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.4
        // must-revalidate is the only case under which we CANNOT return a stale
        // response. If must-revalidate is not set then according to spec it's ok
        // to return a stale response.
        if (mustRevalidate) {
          return persistenceUtils.responseToJSON(response).then(function (responseData) {
            responseData.status = 504;
            responseData.statusText = 'cache-control: must-revalidate failed due to application being offline';
            logger.log("Offline Persistence Toolkit cacheStrategies: Returning Response status 504 based HTTP revalidation");
            return persistenceUtils.responseFromJSON(responseData);
          });
        } else {
          return Promise.resolve(response);
        }
      } else {
        return persistenceManager.browserFetch(request).then(function (serverResponse) {
          if (serverResponse.status == 304) {
            return response;
          } else {
            // revalidation succeeded so we should remove the old entry from the
            // cache
            return persistenceManager.getCache().delete(request).then(function () {
              logger.log("Offline Persistence Toolkit cacheStrategies: Removing old entry based on HTTP revalidation");
              return serverResponse;
            });
          }
        });
      }
    }
    // If it's not a cached Response then it's already from the server so
    // just resolve the response
    return Promise.resolve(response);
  };

  function _cacheResponse(request, response) {
    // persist the Request/Response in our cache
    if (response != null &&
      !persistenceUtils.isCachedResponse(response) &&
      (request.method == 'GET' ||
      request.method == 'HEAD')) {
      var responseClone = response.clone();
      return persistenceManager.getCache().put(request, response).then(function () {
        logger.log("Offline Persistence Toolkit cacheStrategies: Cached Request/Response");
        return responseClone;
      });
    } else {
      return Promise.resolve(response);
    }
  };

  return {'getHttpCacheHeaderStrategy': getHttpCacheHeaderStrategy};
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('defaultResponseProxy',['./persistenceManager', './persistenceUtils', './fetchStrategies',
  './cacheStrategies', './persistenceStoreManager', './impl/defaultCacheHandler', './impl/logger'],
  function (persistenceManager, persistenceUtils, fetchStrategies,
    cacheStrategies, persistenceStoreManager, cacheHandler, logger) {
    'use strict';

    /**
     * Default Response Proxy
     * @export
     * @class DefaultResponseProxy
     * @classdesc  Provides a fetch event listener which uses the default Fetch and Cache strategies.
     * @constructor
     * @param {{jsonProcessor: Object, fetchStrategy: Function, cacheStrategy: Function}=} options Options
     */
    function DefaultResponseProxy(options) {
      options = options || {};

      if (options['fetchStrategy'] == null) {
        options['fetchStrategy'] = fetchStrategies.getCacheIfOfflineStrategy();
      }
      if (options['cacheStrategy'] == null) {
        options['cacheStrategy'] = cacheStrategies.getHttpCacheHeaderStrategy();
      }
      options.requestHandlerOverride = options.requestHandlerOverride || {};

      if (options['requestHandlerOverride']['handleGet'] == null) {
        options['requestHandlerOverride']['handleGet'] = this.handleGet;
      }
      if (options['requestHandlerOverride']['handlePost'] == null) {
        options['requestHandlerOverride']['handlePost'] = this.handlePost;
      }
      if (options['requestHandlerOverride']['handlePut'] == null) {
        options['requestHandlerOverride']['handlePut'] = this.handlePut;
      }
      if (options['requestHandlerOverride']['handlePatch'] == null) {
        options['requestHandlerOverride']['handlePatch'] = this.handlePatch;
      }
      if (options['requestHandlerOverride']['handleDelete'] == null) {
        options['requestHandlerOverride']['handleDelete'] = this.handleDelete;
      }
      if (options['requestHandlerOverride']['handleHead'] == null) {
        options['requestHandlerOverride']['handleHead'] = this.handleHead;
      }
      if (options['requestHandlerOverride']['handleOptions'] == null) {
        options['requestHandlerOverride']['handleOptions'] = this.handleOptions;
      }
      Object.defineProperty(this, '_options', {
        value: options
      });
    };

     /**
     * Return an instance of the default response proxy
     * @method
     * @name getResponseProxy
     * @param {{jsonProcessor: Object, fetchStrategy: Function, cacheStrategy: Function}=} options Options
     * <ul>
     * <li>options.jsonProcessor An object containing the JSON shredder, unshredder, and queryHandler for the responses.</li>
     * <li>options.jsonProcessor.shredder JSON shredder for the responses</li>
     * <li>options.jsonProcessor.unshredder JSON unshredder for the responses</li>
     * <li>options.queryHandler query parameter handler. Should be a function which takes a
     *                          Request and returns a Promise which resolves with a Response
     *                          when the query parameters have been processed. If the Request
     *                          was not handled then resolve to null.</li>
     * <li>options.fetchStrategy Should be a function which takes a
     *                   Request and returns a Promise which resolves to a Response
     *                   If unspecified then uses the default.</li>
     * <li>options.cacheStrategy Should be a function which returns a Promise which
     *                   resolves with a response when the cache expiration behavior has been processed.
     *                   If unspecified then uses the default which
     *                   uses the HTTP cache headers to determine cache expiry.</li>
     * <li>options.requestHandlerOverride An object containing request handler overrides.</li>
     * <li>options.requestHandlerOverride.handleGet Override the default GET request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handlePost Override the default POST request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handlePut Override the default PUT request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handlePatch Override the default PATCH request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handleDelete Override the default DELETE request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handleHead Override the default HEAD request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * <li>options.requestHandlerOverride.handleOptions Override the default OPTIONS request handler with the supplied function.
     * The function should take a Request object as parameter and return a Promise which resolves to a Response object.</li>
     * </ul>
     * @export
     * @static
     * @memberof DefaultResponseProxy
     */
    function getResponseProxy(options) {
      return new DefaultResponseProxy(options);
    };

    /**
     * Returns the Fetch Event listener
     * @method
     * @name getFetchEventListener
     * @return {Function} Returns the fetch event listener
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.getFetchEventListener = function () {
      var self = this;
      return function (event) {
        event.respondWith(
          self.processRequest(event.request)
        )
      };
    };

    /**
     * Process the Request. Use this function if you want to chain request
     * processing within a fetch event listener.
     * @method
     * @name processRequest
     * @param {Request} request Request object
     * @return {Function} Promise
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.processRequest = function (request) {
      var self = this;
      var endpointKey = persistenceUtils.buildEndpointKey(request);
      return new Promise(function (resolve, reject) {
        // set the shredder/unshredder information
        cacheHandler.registerEndpointOptions(endpointKey, self._options);
        var requestHandler = _getRequestHandler(self, request);
        var localVars = {};
        var requestClone = request.clone();
        logger.log("Offline Persistence Toolkit DefaultResponseProxy: Calling requestHandler for request with enpointKey: " + endpointKey);
        requestHandler.call(self, request).then(function (response) {
          if (persistenceUtils.isCachedResponse(response)) {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is cached for request with enpointKey: " + endpointKey);
            localVars.isCachedResponse = true;
          }
          if (response.ok) {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is ok for request with enpointKey: " + endpointKey);
            return _applyCacheStrategy(self, request, response);
          } else {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is not ok for request with enpointKey: " + endpointKey);
            return response;
          }
        }).then(function (response) {
          localVars.response = response;
          if (response.ok) {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is ok after cacheStrategy for request with enpointKey: " + endpointKey);
            // cache the shredded data
            return _cacheShreddedData(request, response);
          } else {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is not ok after cacheStrategy for request with enpointKey: " + endpointKey);
            return null;
          }
        }).then(function (undoRedoDataArray) {
          return _insertSyncManagerRequest(request, undoRedoDataArray, localVars.isCachedResponse);
        }).then(function () {
          cacheHandler.unregisterEndpointOptions(endpointKey);
          resolve(localVars.response);
        }).catch(function (err) {
          logger.log("Offline Persistence Toolkit DefaultResponseProxy: Insert Response in syncManager after error for request with enpointKey: " + endpointKey);
          _insertSyncManagerRequest(requestClone, null, true).then(function() {
            cacheHandler.unregisterEndpointOptions(endpointKey);
            reject(err); 
          }, function() {
            cacheHandler.unregisterEndpointOptions(endpointKey);
            reject(err); 
          });
        });
      });
    };

    function _getRequestHandler(defaultResponseProxy, request) {
      var self = defaultResponseProxy;
      var options = self._options;
      var requestHandler = null;

      if (request.method === 'POST') {
        requestHandler = options['requestHandlerOverride']['handlePost'];
      } else if (request.method === 'GET') {
        requestHandler = options['requestHandlerOverride']['handleGet'];
      } else if (request.method === 'PUT') {
        requestHandler = options['requestHandlerOverride']['handlePut'];
      } else if (request.method === 'PATCH') {
        requestHandler = options['requestHandlerOverride']['handlePatch'];
      } else if (request.method === 'DELETE') {
        requestHandler = options['requestHandlerOverride']['handleDelete'];
      } else if (request.method === 'HEAD') {
        requestHandler = options['requestHandlerOverride']['handleHead'];
      } else if (request.method === 'OPTIONS') {
        requestHandler = options['requestHandlerOverride']['handleOptions'];
      }
      return requestHandler;
    };

    /**
     * The default POST request handler.
     * The default implementation when offline will return a Response with
     * '503 Service Unavailable' error code.
     * @method
     * @name handlePost
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handlePost = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default POST Handler");
      return _handleRequestWithErrorIfOffline(request);
    };

    function _handleRequestWithErrorIfOffline(request) {
      if (!persistenceManager.isOnline()) {
        var init = {'status': 503, 'statusText': 'Must provide handlePost override for offline'};
        return Promise.resolve(new Response(null, init));
      } else {
        return persistenceManager.browserFetch(request);
      }
    };

    /**
     * The default GET request handler.
     * Processes the GET Request using the default logic. Can be overrided to provide
     * custom processing logic.
     * @method
     * @name handleGet
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handleGet = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default GET Handler");
      return _handleGetWithFetchStrategy(this, request);
    };

    function _handleGetWithFetchStrategy(defaultResponseProxy, request) {
      var self = defaultResponseProxy;
      var fetchStrategy = self._options['fetchStrategy'];

      return fetchStrategy(request, self._options);
    };
    
    /**
     * The default HEAD request handler.
     * Processes the HEAD Request using the default logic. Can be overrided to provide
     * custom processing logic.
     * @method
     * @name handleHead
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handleHead = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default HEAD Handler");
      return _handleGetWithFetchStrategy(this, request);
    };
    
    /**
     * The default OPTIONS request handler.
     * The default implementation when offline will return a Response with
     * '503 Service Unavailable' error code.
     * @method
     * @name handleOptions
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handleOptions = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default OPTIONS Handler");
      return _handleRequestWithErrorIfOffline(request);
    };

    /**
     * The default PUT request handler.
     * Processes the PUT Request using the default logic. Can be overrided to provide
     * custom processing logic.
     * @method
     * @name handlePut
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handlePut = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default PUT Handler");
      return _handlePutRequest(this, request);
    };

    function _handlePutRequest(defaultResponseProxy, request) {
      var self = defaultResponseProxy;
      if (persistenceManager.isOnline()) {
        return persistenceManager.browserFetch(request.clone()).then(function (response) {
          // check for response.ok. That indicates HTTP status in the 200-299 range
          if (response.ok) {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is ok for default PUT Handler");
            return response;
          } else {
            return _handleResponseNotOk(self, request, response, _handleOfflinePutRequest);
          }
        }, function (err) {
          return _handleOfflinePutRequest(self, request);
        });
      } else {
        return _handleOfflinePutRequest(self, request);
      }
    };

    function _handleOfflinePutRequest(defaultResponseProxy, request) {
      // first we convert the Request obj to JSON and then we create a
      // a Response obj from that JSON. Request/Response objs have similar
      // properties so that is equivalent to creating a Response obj by
      // copying over Request obj values.
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing offline logic for default PUT Handler");
      return persistenceUtils.requestToJSON(request).then(function (requestData) {
        requestData.status = 200;
        requestData.statusText = 'OK';
        requestData.headers['content-type'] = 'application/json';
        requestData.headers['x-oracle-jscpt-cache-expiration-date'] = '';

        // if the request contains an ETag then we have to generate a new one
        var ifMatch = requestData.headers['if-match'];
        var ifNoneMatch = requestData.headers['if-none-match'];

        if (ifMatch || ifNoneMatch) {
          logger.log("Offline Persistence Toolkit DefaultResponseProxy: Generating ETag for offline Response for default PUT Handler");
          var randomInt = Math.floor(Math.random() * 1000000);
          requestData.headers['etag'] = (Date.now() + randomInt).toString();
          requestData.headers['x-oracle-jscpt-etag-generated'] = requestData.headers['etag'];
          delete requestData.headers['if-match'];
          delete requestData.headers['if-none-match'];
        }

        return persistenceUtils.responseFromJSON(requestData);
      });
    };

    /**
     * The default PATCH request handler.
     * The default implementation when offline will return a Response with
     * '503 Service Unavailable' error code.
     * @method
     * @name handlePatch
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handlePatch = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default PATCH Handler");
      return _handleRequestWithErrorIfOffline(request);
    };

    /**
     * The default DELETE request handler.
     * Processes the DELETE Request using the default logic. Can be overridden to provide
     * custom processing logic.
     * @method
     * @name handleDelete
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to a Response object
     * @export
     * @instance
     * @memberof! DefaultResponseProxy
     */
    DefaultResponseProxy.prototype.handleDelete = function (request) {
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing Request with default DELETE Handler");
      return _handleDeleteRequest(this, request);
    };

    function _handleDeleteRequest(defaultResponseProxy, request) {
      var self = defaultResponseProxy;
      if (persistenceManager.isOnline()) {
        return persistenceManager.browserFetch(request.clone()).then(function (response) {
          // check for response.ok. That indicates HTTP status in the 200-299 range
          if (response.ok) {
            logger.log("Offline Persistence Toolkit DefaultResponseProxy: Response is ok for default DELETE Handler");
            return response;
          } else {
            return _handleResponseNotOk(self, request, response, _handleOfflineDeleteRequest);
          }
        }, function (err) {
          return _handleOfflineDeleteRequest(self, request);
        });
      } else {
        return _handleOfflineDeleteRequest(self, request);
      }
    };

    function _handleOfflineDeleteRequest(defaultResponseProxy, request) {
      var self = defaultResponseProxy;
      // first we convert the Request obj to JSON and then we create a
      // a Response obj from that JSON. Request/Response objs have similar
      // properties so that is equivalent to creating a Response obj by
      // copying over Request obj values.
      logger.log("Offline Persistence Toolkit DefaultResponseProxy: Processing offline logic for default DELETE Handler");
      return persistenceUtils.requestToJSON(request).then(function (requestData) {
        requestData.status = 200;
        requestData.statusText = 'OK';
        requestData.headers['content-type'] = 'application/json';
        requestData.headers['x-oracle-jscpt-cache-expiration-date'] = '';
        return persistenceUtils.responseFromJSON(requestData).then(function (response) {
          // for DELETE requests, we don't have data in the payload but
          // the response does so we have to get the data from the shredded
          // store to construct a response.
          // the DELETE key is in the URL
          var key = _getRequestUrlId(request);
          // query for the data
          var jsonShredder = null;

          if (self._options && self._options.jsonProcessor &&
            self._options.jsonProcessor.shredder) {
            jsonShredder = self._options.jsonProcessor.shredder;
          }

          if (jsonShredder) {
            return jsonShredder(response).then(function (shreddedObjArray) {
              if (shreddedObjArray) {
                // only look at the first one
                var storeName = shreddedObjArray[0]['name'];
                return persistenceStoreManager.openStore(storeName).then(function (store) {
                  return store.findByKey(key).then(function (row) {
                    // set the payload with the data we got from the shredded store
                    if (row) {
                      return persistenceUtils.responseFromJSON(requestData).then(function (response) {
                        return persistenceUtils.setResponsePayload(response, row).then(function (response) {
                          return response;
                        });
                      });
                    } else {
                      return response;
                    }
                  });
                });
              } else {
                return response;
              }
            });
          } else {
            // if we don't have shredded data then just resolve. The Response obj payload
            // will be empty but that's the best we can do.
            return response;
          }
        });
      });
    };

    function _handleResponseNotOk(defaultResponseProxy, request, response, offlineHandler) {
      var self = defaultResponseProxy;
      // for 300-499 range, we should not fetch from cache.
      // 300-399 are redirect errors
      // 400-499 are client errors which should be handled by the client
      if (response.status < 500) {
        return Promise.resolve(response);
      } else {
        // 500-599 are server errors so we can fetch from cache
        return offlineHandler(self, request);
      }
    };

    function _getRequestUrlId(request) {
      var urlTokens = request.url.split('/');
      return urlTokens[urlTokens.length - 1];
    };

    function _applyCacheStrategy(defaultResponseProxy, request, response) {
      var self = defaultResponseProxy;
      if (request.method === 'GET' ||
        request.method === 'HEAD') {
        var cacheStrategy = self._options['cacheStrategy'];
        return cacheStrategy(request, response, self._options);
      } else {
        return Promise.resolve(response);
      }
    };

    function _insertSyncManagerRequest(request, undoRedoDataArray, force) {
      if (!persistenceManager.isOnline() || force) {
        // put the request in the sync manager if offline or if force is true
        return persistenceManager.getSyncManager().insertRequest(request, {'undoRedoDataArray': undoRedoDataArray});
      }
      return Promise.resolve();
    };

    function _cacheShreddedData(request, response) {
      if (request.method == 'GET' ||
        request.method == 'HEAD') {
        return persistenceManager.getCache().hasMatch(request, {ignoreSearch: true}).then(function (matchExist) {
          if (matchExist) {
            // the cache strategy would have cached the response unless
            // response is not to be stored, e.g. no-store. In that case we don't want
            // to shred
            return _processShreddedData(request, response);
          } else {
            return Promise.resolve();
          }
        });
      } else {
        return _processShreddedData(request, response);
      }
    };

    function _processShreddedData(request, response) {
      return cacheHandler.constructShreddedData(request, response).then(function (shreddedData) {
        if (shreddedData) {
          // if we have shredded data then update the local store with it
          return _updateShreddedDataStore(request, shreddedData);
        } else {
          return Promise.resolve();
        }
      });
    };

    function _updateShreddedDataStore(request, shreddedData) {
      var promises = [];
      shreddedData.forEach(function (shreddedDataItem) {
        var storename = Object.keys(shreddedDataItem)[0];
        promises.push(_updateShreddedDataStoreForItem(request, storename, shreddedDataItem[storename]));
      });

      return Promise.all(promises);
    };

    function _updateShreddedDataStoreForItem(request, storename, shreddedDataItem) {
      return _getUndoRedoDataForShreddedDataItem(request, storename, shreddedDataItem).then(function (undoRedoArray) {
        if (request.method === 'DELETE') {
          return _updateShreddedDataStoreForDeleteRequest(storename, shreddedDataItem, undoRedoArray);
        } else {
          return _updateShreddedDataStoreForNonDeleteRequest(storename, shreddedDataItem, undoRedoArray);
        }
      });
    };

    function _getUndoRedoDataForShreddedDataItem(request, storename, shreddedDataItem) {
      var undoRedoArray = [];
      var key;
      var value;

      var undoRedoData = function (i, dataArray) {
        // we should not have any undoRedo data for GET requests
        if (i < dataArray.length &&
          request.method !== 'GET' &&
          request.method !== 'HEAD') {
          key = dataArray[i]['key'].toString();

          if (request.method !== 'DELETE') {
            value = dataArray[i]['value'];
          } else {
            // redo data is null for DELETE
            value = null;
          }

          // find the existing data so we can get the undo data
          return persistenceStoreManager.openStore(storename).then(function (store) {
            return store.findByKey(key).then(function (undoRow) {
              undoRedoArray.push({'key': key, 'undo': undoRow, 'redo': value});
              return undoRedoData(++i, dataArray);
            }, function (error) {
              // if there is no existing data then undo is null
              undoRedoArray.push({'key': key, 'undo': null, 'redo': value});
              return undoRedoData(++i, dataArray);
            });
          });
        } else {
          return Promise.resolve(undoRedoArray);
        }
      };
      return undoRedoData(0, shreddedDataItem);
    };

    function _updateShreddedDataStoreForNonDeleteRequest(storename, shreddedDataItem, undoRedoArray) {
      // for other requests, upsert the shredded data
      return persistenceStoreManager.openStore(storename).then(function (store) {
        return store.upsertAll(shreddedDataItem);
      }).then(function () {
        if (undoRedoArray.length > 0) {
          return {'storeName': storename, 'operation': 'upsert', 'undoRedoData': undoRedoArray};
        } else {
          return null;
        }
      });
    };

    function _updateShreddedDataStoreForDeleteRequest(storename, shreddedDataItem, undoRedoArray) {
      // for DELETE requests, simple remove the existing shredded data
      return persistenceStoreManager.openStore(storename).then(function (store) {
        return store.removeByKey(shreddedDataItem[0]['key']);
      }).then(function () {
        if (undoRedoArray.length > 0) {
          return {'storeName': storename, 'operation': 'remove', 'undoRedoData': undoRedoArray};
        } else {
          return null;
        }
      });
    };

    return {'getResponseProxy': getResponseProxy};
  });


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('simpleJsonShredding',['./persistenceUtils', './impl/logger'], function (persistenceUtils, logger) {
  'use strict';
    
  /**
   * @export
   * @class simpleJsonShredding
   * @classdesc Shredder for REST services which have a JSON structure. If the
   * JSON contained in the payload is hierchical the shredder will only process
   * the first level in the hierarchy. The shredder transforms the JSON payload
   * into a flat list of ids and data items.
   * @hideconstructor
   */

  /**
   * Return the shredder for simple JSON
   * @method
   * @name getShredder
   * @memberof simpleJsonShredding
   * @param {string} storeName Name of the Persistent Store into which the shredded data should be stored
   * @param {string} idAttr The id field in the JSON data
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   */
  var getShredder = function (storeName, idAttr) {
    return function (response) {
      logger.log("Offline Persistence Toolkit simpleJsonShredding: Shredding Response");
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('Etag');
      return responseClone.text().then(function (payload) {
        var idArray = [];
        var dataArray = [];
        var resourceType = 'collection';
        if (payload &&
          payload.length > 0) {
          try {
            var payloadJson = JSON.parse(payload);
            if (Array.isArray(payloadJson)) {
              idArray = payloadJson.map(function (jsonEntry) {
                return jsonEntry[idAttr];
              });
              dataArray = payloadJson;
            } else {
              idArray[0] = payloadJson[idAttr];
              dataArray[0] = payloadJson;
              resourceType = 'single';
            }
          } catch (err) {
            logger.log("Offline Persistence Toolkit simpleRestJsonShredding: Error during shredding: " + err);
          }
        }
        return [{
            'name': storeName,
            'resourceIdentifier': resourceIdentifier,
            'keys': idArray,
            'data': dataArray,
            'resourceType' : resourceType
          }];
      });
    };
  };

  /**
   * Return the unshredder for simple JSON
   * @method
   * @name getUnshredder
   * @memberof simpleJsonShredding
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function () {
    return function (data, response) {
      logger.log("Offline Persistence Toolkit simpleJsonShredding: Unshredding Response");
      return Promise.resolve().then(function () {
        var dataContent = _retrieveDataContent(data);
        return persistenceUtils.setResponsePayload(response, dataContent);
      }).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return Promise.resolve(response);
      });
    };
  };

  // helper method to retrieve the data content from the valueArray. In general,
  // valueArray is an array where each element contains an object where the 
  // key is the name of the store while the value is the shredded data from 
  // that store. For simple json shredder/unshredder, the valueArray should 
  // contain only one entry.
  function _retrieveDataContent(valueArray) {
    if (!valueArray || valueArray.length !== 1) {
      throw new Error({message: 'shredded data is not in the correct format.'});
    }
    var data = valueArray[0].data;
    if (data && data.length === 1 && valueArray[0].resourceType === 'single') {
      return data[0];
    }
    return data;
  };

  return {
    getShredder: getShredder,
    getUnshredder: getUnshredder
  };
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('oracleRestJsonShredding',['./persistenceUtils', './impl/logger'], function (persistenceUtils, logger) {
  'use strict';
  
  /**
   * @export
   * @class oracleRestJsonShredding
   * @classdesc Shredder for REST services which conform to the Oracle REST standard.
   * @hideconstructor
   */
  
  /**
   * Return the shredder for Oracle REST JSON
   * @method
   * @name getShredder
   * @memberof oracleRestJsonShredding
   * @static
   * @param {string} storeName Name of the Persistent Store into which the shredded data should be stored
   * @param {string} idAttr The id field in the JSON data
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * <code>
   * <pre>
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * </pre>
   * </code>
   */
  var getShredder = function (storeName, idAttr) {
    return function (response) {
      logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Shredding Response");
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('X-ORACLE-DMS-ECID');
      return responseClone.text().then(function (payload) {
        var idArray = [];
        var dataArray = [];
        var resourceType = 'collection';
        if (payload != null &&
          payload.length > 0) {
          try {
            var payloadJson = JSON.parse(payload);
            if (payloadJson.items != null) {
              idArray = payloadJson.items.map(function (jsonEntry) {
                return jsonEntry[idAttr];
              });
              dataArray = payloadJson.items;
            } else {
              idArray[0] = payloadJson[idAttr];
              dataArray[0] = payloadJson;
              resourceType = 'single';
            }
          } catch (err) {
            logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Error during shredding: " + err);
          }
        }
        return [{
            'name': storeName,
            'resourceIdentifier': resourceIdentifier,
            'keys': idArray,
            'data': dataArray,
            'resourceType' : resourceType
          }];
      });
    };
  };

  /**
   * Return the unshredder for Oracle REST JSON
   * @method
   * @name getUnshredder
   * @memberof oracleRestJsonShredding
   * @static
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * <code>
   * <pre>
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single' or 'collection'
   * }
   * </pre>
   * </code>
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function () {
    return function (value, response) {
      logger.log("Offline Persistence Toolkit oracleRestJsonShredding: Unshredding Response");
      var payload = _buildPayload(value, response);
      return persistenceUtils.setResponsePayload(response, payload).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return response;
      });
    };
  }

  function _buildPayload (value, response) {
    if (!value || value.length !== 1) {
      throw new Error({message: 'shredded data is not in the correct format.'});
    }
    var payload;
    var data = value[0].data;
    if (data && data.length === 1 && value[0].resourceType === 'single') {
      payload = data[0];
    } else {
      payload = {items: data,
        count: data.length};
    }
    return payload;
  };

  return {
    getShredder: getShredder,
    getUnshredder: getUnshredder};
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('simpleBinaryDataShredding',['./persistenceUtils'], function (persistenceUtils) {
  'use strict';
    
  /**
   * @export
   * @class simpleBinaryDataShredding
   * @classdesc Shredder for simple binary data GET requests. The URL is used as key.
   */
  
  /**
   * Return the shredder for simple Binary Data
   * @method
   * @name getShredder
   * @memberof! simpleBinaryDataShredding
   * @instance
   * @param {string} storeName Name of the Persistent Store into which the shredded data should be stored
   * @return {Function} shredder The shredder function takes a Response object as
   * parameter and returns a Promise which resolves to an array of objects which have the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single'
   * }
   */
  var getShredder = function (storeName) {
    return function (response) {
      var responseClone = response.clone();
      var resourceIdentifier = responseClone.headers.get('Etag');
      return responseClone.blob().then(function (blob) {
        var idArray = [];
        var dataArray = [];
        idArray[0] = response.url == null || response.url.length == 0 ? response.headers.get('x-oracle-jscpt-response-url') : response.url;
        dataArray[0] = blob;
        return [{
          'name': storeName,
          'resourceIdentifier': resourceIdentifier,
          'keys': idArray,
          'data': dataArray,
          'resourceType' : 'single'
        }];
      });
    }
  };

  /**
   * Return the unshredder for simple Binary Data
   * @method
   * @name getUnshredder
   * @memberof! simpleBinaryDataShredding
   * @instance
   * @return {Function} unshredder The unshredder function takes an array of objects 
   * and a response object as parameters. The array of objects has the following
   * structure:
   * {
   *  'name': storeName, 
   *  'resourceIdentifier': resourceIdentifier, 
   *  'keys': idArray, 
   *  'data': dataArray,
   *  'resourceType' : 'single'
   * }
   * The unshredder returns a Promise which resolves to a Response object.
   */
  var getUnshredder = function () {
    return function (data, response) {
      var dataContent = _retrieveDataContent(data);
      return persistenceUtils.setResponsePayload(response, dataContent).then(function (response) {
        response.headers.set('x-oracle-jscpt-cache-expiration-date', '');
        return Promise.resolve(response);
      });
    };
  };

  // helper method to retrieve the data content from the valueArray. In general,
  // valueArray is an array where each element contains an object where the 
  // key is the name of the store while the value is the shredded data from 
  // that store. For simple json shredder/unshredder, the valueArray should 
  // contain only one entry.
  function _retrieveDataContent(valueArray) {
    if (!valueArray || valueArray.length !== 1) {
      throw new Error({message: 'shredded data is not in the correct format.'});
    }
    var data = valueArray[0].data;
    if (data && data.length === 1 && valueArray[0].resourceType === 'single') {
      return data[0];
    }
    return data;
  };

  return {
    getShredder: getShredder,
    getUnshredder: getUnshredder
  };
});


/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define('queryHandlers',['./persistenceManager', './persistenceStoreManager', './persistenceUtils', './impl/logger'],
  function (persistenceManager, persistenceStoreManager, persistenceUtils, logger) {
    'use strict';
  
    /**
     * @class queryHandlers
     * @classdesc Contains out of the box query handlers.
     * @export
     * @hideconstructor
     */
    
    /**
     * Returns the Oracle Rest Query Handler which handles the query parameters
     * according to the Oracle Rest Specification. Note the Oracle Rest Specification
     * requires queries to be specified in the q parameter e.g. ?q= but does not
     * enforce a particular format for the query itself. Therefore this API takes a parameter
     * createQueryExp where the developer can plugin a function which takes the parameter
     * value and returns a persistence store query. If none if provided then the
     * default is to use the ADFBc REST query parameter structure which has the form
     * ?q=EmpId=100
     * In addition, the query handler supports the limit and offset query parameters
     * used for paging in the Oracle REST specification.
     * @method
     * @name getOracleRestQueryHandler
     * @memberof queryHandlers
     * @static
     * @param {string} storeName The store name against which queries should be executed
     * @param {function=} createQueryExp Optional function takes URL query parameters
     * and returns a query expression which will be executed against the persistent store.
     * If null then use the ADFBc REST query parameter structure.
     * @return {Function} Returns the query handler
     */
    function getOracleRestQueryHandler(storeName, createQueryExp) {
      createQueryExp = createQueryExp || function (urlParams) {
        return _createQueryFromAdfBcParams(urlParams, null);
      }
      return function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: OracleRestQueryHandler processing request");
          var urlParams = request.url.split('?');
          var findQuery = {};
          var queryParams;
          var queryParamsIter;

          if (typeof URLSearchParams === 'undefined') {
            // IE does not support URLSearchParams so parse
            // it ourselves
            queryParamsIter = _parseURLSearchParams(urlParams[1]);
          } else {
            queryParamsIter = (new URLSearchParams(urlParams[1])).entries();
          }

          var queryParamEntry;
          var queryParamName;
          var queryParamValue;
          var limit;
          var offset;

          do {
            queryParamEntry = queryParamsIter.next();

            if (queryParamEntry['value'] != null) {
              queryParamName = queryParamEntry['value'][0];
              queryParamValue = queryParamEntry['value'][1];

              if (queryParamName == 'q') {
                queryParams = queryParamValue;
              } else if (queryParamName == 'limit') {
                limit = queryParamValue;
              } else if (queryParamName == 'offset') {
                offset = queryParamValue;
              }
            }
          } while (!queryParamEntry['done']);

          var findQuery = createQueryExp(queryParams);

          var shredder;
          var unshredder;

          if (options['jsonProcessor'] != null) {
            shredder = options['jsonProcessor']['shredder'];
            unshredder = options['jsonProcessor']['unshredder'];
          }

          if (shredder != null &&
            unshredder != null) {
            return _processQuery(request, storeName, findQuery, shredder, unshredder, offset, limit).then(function(response) {
              if (!response) {
                return Promise.resolve();
              }
              var responseClone = response.clone();
              return responseClone.text().then(function (payload) {
                if (payload != null &&
                  payload.length > 0) {
                  try {
                    var payloadJson = JSON.parse(payload);
                    if (!payloadJson.links) {
                      payloadJson.links = [{rel: 'self', href: request.url}];
                      return persistenceUtils.setResponsePayload(response, payloadJson).then(function (response) {
                        return Promise.resolve(response);
                      });
                    } else {
                      return Promise.resolve(response);
                    }
                  } catch (err) {
                  }
                }
              });
            });
          }
        }
        return Promise.resolve();
      };
    };
    
    function _processQuery(request, storeName, findQuery, shredder, unshredder, offset, limit) {
      // first check of we have a collection query or single row query
      // collection query will always return true for cache.hasMatch()
      // single row query will return hasMatch true if that query
      // was executed before, if not we have to query for it
      return persistenceManager.getCache().hasMatch(request, {ignoreSearch: true}).then(function (hasMatch) {
        return persistenceStoreManager.openStore(storeName).then(function (store) {
          if (hasMatch) {
            // query in the shredded data
            return store.find(findQuery);
          } else {
            // this might be a single row query so we need to parse the URL for an id based query
            var id = _getRequestUrlId(request);
            if (id) {
              return store.findByKey(id);
            }
            return Promise.resolve([]);
          }
        }).then(function (results) {
          return persistenceManager.getCache().match(request, {ignoreSearch: true}).then(function (response) {
            if (response) {
              var hasMore = false;
              if (results) {
                if (offset
                  && offset > 0) {
                  if (offset < results.length)
                  {
                    hasMore = true;
                  }
                  else
                  {
                    hasMore = false;
                  }
                  results = results.slice(offset, results.length);
                }
                if (limit
                  && limit > 0) {
                  if (limit <= results.length)
                  {
                    hasMore = true;
                  }
                  else
                  {
                    hasMore = false;
                  }
                  results = results.slice(0, limit);
                }
              }
              return shredder(response).then(function (dataArray) {
                var resourceType = dataArray[0].resourceType;
                var transformedResults = {
                  name: storeName,
                  data: results,
                  resourceType: resourceType
                };
                return unshredder([transformedResults], response).then(function (response) {
                  // add limit and offset
                  var responseClone = response.clone();
                  return responseClone.text().then(function (payload) {
                    if (payload != null &&
                      payload.length > 0) {
                      try {
                        var payloadJson = JSON.parse(payload);
                        if (payloadJson.items != null) {
                          if (limit) {
                            payloadJson.limit = parseInt(limit, 10);
                          }
                          if (offset) {
                            payloadJson.offset = parseInt(offset, 10);
                          }
                          payloadJson.hasMore = hasMore;
                        }
                        return persistenceUtils.setResponsePayload(response, payloadJson);
                      } catch (err) {
                      }
                    } else {
                      return response;
                    }
                  });
                });
              });
            } else if (results && Object.keys(results).length > 0) {
              // this means have a single query result
              var collectionUrl = _getRequestCollectionUrl(request);
              if (collectionUrl) {
                return persistenceUtils.requestToJSON(request).then(function (requestObj) {
                  requestObj.url = collectionUrl;
                  return persistenceUtils.requestFromJSON(requestObj).then(function (collectionRequest) {
                    return persistenceManager.getCache().match(collectionRequest, {ignoreSearch: true}).then(function (response) {
                      if (response) {
                        var transformedResults = {
                          name: storeName,
                          data: [results],
                          resourceType: 'single'
                        };
                        return unshredder([transformedResults], response);
                      }
                    });
                  });
                });
              } else {
                return Promise.resolve();
              }
            } else {
              return Promise.resolve();
            }
          });
        });
      });
    };
    
    function _createQueryFromAdfBcParams(value) {
      var findQuery = {};

      if (value) {
        var queryExpArray = value.split(';');
        var i;
        var queryKey;
        var selectorQuery = {};
        for (i = 0; i < queryExpArray.length; i++) {
          queryKey = queryExpArray[i].split('=')[0];

          if (queryKey) {
            var queryVal = queryExpArray[i].split('=')[1].replace(/^"|'(.*)'|"$/, '$1');
            selectorQuery["value." + queryKey] = queryVal;
          }
        }

        if (Object.keys(selectorQuery).length > 0) {
          findQuery.selector = selectorQuery;
        }
      }
      return findQuery;
    };
  
    /**
     * Returns the Simple Query Handler which matches the URL query parameter/value pairs
     * against the store's field/value pairs.
     * @method
     * @name getSimpleQueryHandler
     * @memberof queryHandlers
     * @static
     * @param {string} storeName The store name against which queries should be executed
     * @param {Array} ignoreUrlParams An array of URL params to be ignored
     * @return {Function} Returns the query handler
     */
    function getSimpleQueryHandler(storeName, ignoreUrlParams) {
      return function (request, options) {
        if (request.method == 'GET' ||
          request.method == 'HEAD') {
          logger.log("Offline Persistence Toolkit queryHandlers: SimpleQueryHandler processing request");
          // applies to all GET requests. If there are any URL query params
          // then the keys in the parameter are directly mapped to the shredded
          // data fields and values to the shredded data values
          var urlParams = request.url.split('?');
          var findQuery = _createQueryFromUrlParams(urlParams, ignoreUrlParams);

          var shredder;
          var unshredder;

          if (options['jsonProcessor'] != null) {
            shredder = options['jsonProcessor']['shredder'];
            unshredder = options['jsonProcessor']['unshredder'];
          }

          if (shredder != null &&
            unshredder != null) {
            return _processQuery(request, storeName, findQuery, shredder, unshredder);
          }
        }
        return Promise.resolve();
      };
    };
    
    function _createQueryFromUrlParams(urlParams, ignoreUrlParams) {
      var findQuery = {};
      
      if (urlParams &&
        urlParams.length > 1) {
        var selectorQuery = {};
        var queryParamsIter;

        if (typeof URLSearchParams === 'undefined') {
          // IE does not support URLSearchParams so parse
          // it ourselves
          queryParamsIter = _parseURLSearchParams(urlParams[1]);
        } else {
          queryParamsIter = (new URLSearchParams(urlParams[1])).entries();
        }

        var queryParamEntry;
        var queryParamName;
        var queryParamValue;

        do {
          queryParamEntry = queryParamsIter.next();

          if (queryParamEntry['value'] != null) {
            queryParamName = queryParamEntry['value'][0];
            queryParamValue = queryParamEntry['value'][1];

            if (!ignoreUrlParams ||
              ignoreUrlParams.indexOf(queryParamName) == -1) {
              // build our query
              selectorQuery["value." + queryParamName] = queryParamValue;
            }
          }
        } while (!queryParamEntry['done']);

        if (Object.keys(selectorQuery).length > 0) {
          findQuery.selector = selectorQuery;
        }
      }
      return findQuery;
    };

    function _parseURLSearchParams(query) {
      // parse the URL query params. Does the same as
      // URLSearchParams but use for IE which doesn't support URLSearchParams.
      var params = [];
      if (query != null) {
        // URLSearchParams requires that the implementation strip off an initial ? char
        if (query.charAt(0) === '?') {
          query = query.slice(1);
        }
        query = query || '';
        var paramPairs = query.split('&');
        var paramName;
        var paramValue
        var index;
        params = paramPairs.map(function (paramPair) {
          index = paramPair.indexOf('=');

          if (index > -1) {
            paramName = paramPair.slice(0, index);
            paramValue = paramPair.slice(index + 1);
            paramValue = _cleanURIValue(paramValue);
          } else {
            paramName = paramPair;
            paramValue = '';
          }
          paramName = _cleanURIValue(paramName);
          return [paramName, paramValue];
        });
      }

      var iterator =
        {
          next: function () {
            var value = params.shift();
            return {done: value === undefined, value: value};
          }
        };

      return iterator;
    };
    
    function _cleanURIValue(value) {
      return decodeURIComponent(value.replace(/\+/g, ' '));
    };
    
    function _getRequestUrlId(request) {
      var urlTokens = request.url.split('/');
      if (urlTokens.length > 1) {
        return urlTokens[urlTokens.length - 1];
      }
      return null;
    };
    
    function _getRequestCollectionUrl(request) {
      var urlTokens = request.url.split('/');
      if (urlTokens.length > 1) {
        var id = _getRequestUrlId(request);
        return request.url.substring(0, request.url.length - id.length - 1);
      }
      return null;
    };

    return {'getSimpleQueryHandler': getSimpleQueryHandler,
      'getOracleRestQueryHandler': getOracleRestQueryHandler};
  });


