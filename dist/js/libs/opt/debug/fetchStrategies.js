/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceManager', './persistenceUtils', './impl/defaultCacheHandler','./impl/logger'],
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

