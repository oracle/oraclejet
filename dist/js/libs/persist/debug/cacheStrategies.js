/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./persistenceManager', './persistenceUtils', './impl/logger'], function (persistenceManager, persistenceUtils, logger) {
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

