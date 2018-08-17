/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define(['./impl/PersistenceXMLHttpRequest', './impl/PersistenceSyncManager', './impl/offlineCacheManager', './impl/logger', './impl/fetch'],
  function (PersistenceXMLHttpRequest, PersistenceSyncManager, offlineCacheManager, logger) {
    'use strict';

    /**
     * @export
     * @class PersistenceManager
     * @classdesc PersistenceManager used for offline support
     */
    function PersistenceManager() {
      Object.defineProperty(this, '_registrations', {
        value: [],
        writable: true
      });
      Object.defineProperty(this, '_eventListeners', {
        value: [],
        writable: true
      });
      Object.defineProperty(this, '_forceOffline', {
        value: false,
        writable: true
      });
      Object.defineProperty(this, '_isOffline', {
        value: false,
        writable: true
      });
      Object.defineProperty(this, '_cache', {
        value: null,
        writable: true
      });
      Object.defineProperty(this, '_persistenceSyncManager', {
        value: new PersistenceSyncManager(this.isOnline.bind(this), this.browserFetch.bind(this), this.getCache.bind(this))
      });
    };

    /**
     * @method
     * @name init
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {Promise} returns a Promise when resolved that this
     *                   PersistenceManager is fully initialized.
     */
    PersistenceManager.prototype.init = function () {
      _replaceBrowserApis(this);
      _addBrowserEventListeners(this);

      return _openOfflineCache(this);
    };

    /**
     * Force the PersistenceManager offline.
     * @method
     * @name forceOffline
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {boolean} offline If true, sets the PersistenceManager offline
     */
    PersistenceManager.prototype.forceOffline = function (offline) {
      logger.log("Offline Persistence Toolkit PersistenceManager: forceOffline is called with value: " + offline);
      this._forceOffline = offline;
    };

    /**
     * @method
     * @name getCache
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {OfflineCache} returns the cache store for the Persistence Framework. Implements the Cache API.
     */
    PersistenceManager.prototype.getCache = function () {
      return this._cache;
    };

    /**
     * Checks if online.
     * Returns true if the browser and PersistenceManager is online.
     * Returns false if the browser or PersistenceManager is offline.
     * 
     * Note: To determine if the browser is online, the function will use
     * navigator.onLine whose behavior is browser specific. If being used
     * in a hybrid mobile application, please install the Cordova plugin:
     * 
     * https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/
     * 
     * Installing the plugin will enable this function to return accurate
     * browser online status.
     * 
     * @method
     * @name isOnline
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {boolean} Returns true if online, false if not.
     */
    PersistenceManager.prototype.isOnline = function () {
      var online = navigator.onLine;

      if (navigator.network &&
        navigator.network.connection &&
        navigator.network.connection.type == Connection.NONE) {
        online = false;
        logger.log("Offline Persistence Toolkit PersistenceManager: Cordova network info plugin is returning online value: " + online);
      }
      return online && !this._isOffline && !this._forceOffline;
    };

    /**
     * Registers a URL for persistence
     * @method
     * @name register
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {{scope: string}=} options Options to control registration
     * <ul>
     * <li>options.scope The URI which should be persisted.</li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves to a PersistenceRegistration object for the specified options.
     * If options is null, returns an array of all current PersistenceRegistration objects or null if there are none.
     */
    PersistenceManager.prototype.register = function (options) {
      options = options || {};
      var registration = new PersistenceRegistration(options['scope'], this);
      this._registrations.push(registration);

      return Promise.resolve(registration);
    };

    /**
     * Return the registration object for the URL
     * @method
     * @name getRegistration
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {string} url Url
     * @return {Promise} Returns a Promise which resolves to the
     * registration object for the URL or undefined.
     */
    PersistenceManager.prototype.getRegistration = function (url) {
      var i;
      var registration;
      var registrationCount = this._registrations.length;

      for (i = 0; i < registrationCount; i++) {
        registration = this._registrations[i];

        if (url.match(registration.scope)) {
          return Promise.resolve(registration);
        }
      }
      return Promise.resolve();
    };

    /**
     * Return an array of Registration objects
     * @method
     * @name getRegistrations
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {Promise} Returns a Promise which resolves to an array of
     * Registration objects.
     */
    PersistenceManager.prototype.getRegistrations = function () {
      return Promise.resolve(this._registrations.slice());
    };

    /**
     * Return the Sync Manager
     * @method
     * @name getSyncManager
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @return {PersistenceSyncManager} Returns the Sync Manager
     */
    PersistenceManager.prototype.getSyncManager = function () {
      return this._persistenceSyncManager;
    };

    /**
     * Call fetch without going through the persistence framework. This is the
     * unproxied browser provided fetch API.
     * @method
     * @name browserFetch
     * @memberof! PersistenceManager
     * @export
     * @instance
     * @param {String|Request} request A USVString containing the direct URL of the
     * resource you want to fetch or a Request object.
     * @return {Promise} Resolves to the Response when complete
     */
    PersistenceManager.prototype.browserFetch = function (request) {
      logger.log("Offline Persistence Toolkit PersistenceManager: browserFetch() for Request with url: " + request.url);
      // only do special processing in browser context. In service worker context
      // just call regular fetch.
      if (_isBrowserContext()) {
        // store the last Request object on the PersistenceManager so that we
        // can detect if a fetch polyfill is causing a XHR request to our
        // XHR adapter
        Object.defineProperty(this, '_browserFetchRequest', {
          value: request,
          writable: true
        });
        var self = this;
        return new Promise(function (resolve, reject) {
          logger.log("Offline Persistence Toolkit PersistenceManager: Calling browser fetch function for Request with url: " + request.url);
          self._browserFetchFunc.call(window, request).then(function (response) {
            resolve(response);
          }, function (error) {
            reject(error);
          });
          self._browserFetchRequest = null;
        });
      } else {
        return fetch(request);
      }
    };

    function _addBrowserEventListeners(persistenceManager) {
      var self = persistenceManager;
      // add listeners for browser online
      // Don't do it for Service Workers
      if (_isBrowserContext() &&
        !self._addedBrowserEventListeners) {
        logger.log("Offline Persistence Toolkit PersistenceManager: Adding browser event listeners");
        window.addEventListener('offline', function (e) {
          self._isOffline = true;
        }, false);

        window.addEventListener('online', function (e) {
          self._isOffline = false;
        }, false);
        self._addedBrowserEventListeners = true;
      }
    };

    function _isBrowserContext() {
      return (typeof window != 'undefined') && (window != null);
    };

    function _dispatchEvent(persistenceManager, eventType, event) {
      var i;
      var j;
      var returnValue;
      var registration;
      var respondWithPromise = null;
      var registrations = persistenceManager._registrations;
      var registrationCount = registrations != null ? registrations.length : 0;
      var eventListenerCount;
      for (i = 0; i < registrationCount; i++) {
        registration = registrations[i];

        if (event.request.url.match(registration['scope']) != null) {
          eventListenerCount = registration._eventListeners.length;

          for (j = 0; j < eventListenerCount; j++) {
            if (registration._eventListeners[j]['type'] == eventType) {
              if (eventType == 'fetch') {
                if (respondWithPromise === null &&
                  event._setPromiseCallbacks instanceof Function) {
                  respondWithPromise = new Promise(function (resolve, reject) {
                    event._setPromiseCallbacks(resolve, reject);
                  });
                }
                logger.log("Offline Persistence Toolkit PersistenceManager: Calling fetch event listener");
                registration._eventListeners[j]['listener'](event);
              } else {
                logger.log("Offline Persistence Toolkit PersistenceManager: Calling event listener");
                returnValue = registration._eventListeners[j]['listener'](event);

                if (returnValue === false) {
                  // event cancelled
                  return false;
                }
              }
            }
          }

          if (respondWithPromise != null) {
            return respondWithPromise;
          }
        }
      }
      return true;
    };

    function _openOfflineCache(persistenceManager) {
      var self = persistenceManager;

      return offlineCacheManager.open('systemCache').then(function (cache) {
        self._cache = cache;
        return Promise.resolve();
      });
    };

    function _replaceBrowserApis(persistenceManager) {
      var self = persistenceManager;
      // save off the browser fetch and XHR only in browser context.
      // also add listeners for browser online
      // Don't do it for Service Workers
      if (_isBrowserContext() &&
        !self._browserFetchFunc &&
        !self._browserXMLHttpRequest) {
        // browser context
        // _browserFetchFunc is always non-null because we polyfill it
        logger.log("Offline Persistence Toolkit PersistenceManager: Replacing browser APIs");
        Object.defineProperty(self, '_browserFetchFunc', {
          value: window.fetch,
          writable: false
        });
        Object.defineProperty(self, '_browserXMLHttpRequest', {
          value: window.XMLHttpRequest,
          writable: false
        });
        // replace the browser fetch and XHR with our own
        window['fetch'] = persistenceFetch(persistenceManager);
        window['XMLHttpRequest'] = function () {
          if (self._browserFetchRequest != null) {
            // this means we got invoked by a fetch polyfill. That means
            // we can just use the browser XHR since the browser doesn't
            // support the Fetch API anyway
            return new self._browserXMLHttpRequest();
          }
          return new PersistenceXMLHttpRequest(self._browserXMLHttpRequest);
        };
      }
    };

    function _unregister(persistenceManager, registration) {
      var self = persistenceManager
      var regIdx = self._registrations.indexOf(registration);

      if (regIdx > -1) {
        self._registrations.splice(regIdx, 1);
        return true;
      }
      return false;
    };

    /**
     * @export
     * @class PersistenceRegistration
     * @classdesc PersistenceRegistration constructor
     * @constructor
     * @param {string} scope The URI which should be persisted
     * @param {Object} persistenceManager
     */
    function PersistenceRegistration(scope, persistenceManager) {
      Object.defineProperty(this, 'scope', {
        value: scope,
        enumerable: true
      });
      Object.defineProperty(this, '_persistenceManager', {
        value: persistenceManager
      });
      Object.defineProperty(this, '_eventListeners', {
        value: [],
        writable: true
      });
    }
    ;

    /**
     * @export
     * @instance
     * @memberof! PersistenceRegistration
     * @desc The scope for the registration. This is the unique identifier for each registration.
     *
     * @type {string}
     */

    /**
     * Add an event listener.
     * @method
     * @name addEventListener
     * @memberof! PersistenceRegistration
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for. Supported value is "fetch"
     * which will trigger the function with a FetchEvent once a fetch occurs.
     * @param {Function} listener The object that receives a notification when an event of the specified type occurs
     */
    PersistenceRegistration.prototype.addEventListener = function (type, listener) {
      this._eventListeners.push({'type': type.toLowerCase(),
                                'listener': listener});
    };

    /**
     * Unregister the registration. Will finish any ongoing operations before it is unregistered.
     * @method
     * @name unregister
     * @memberof! PersistenceRegistration
     * @export
     * @instance
     * @return {Promise} Promise resolves with a boolean indicating whether the scope has been unregistered or not
     */
    PersistenceRegistration.prototype.unregister = function () {
      return Promise.resolve(_unregister(this._persistenceManager, this));
    };

    // this is the persistence version of fetch which we replace the browser
    // version with. We only do this in browser context, not in service worker context.
    // The replacement is done in persistenceManager.
    function persistenceFetch(persistenceManager) {
      function PersistenceFetchEvent(request) {
        Object.defineProperty(this, 'isReload', {
          value: false,
          enumerable: true
        });
        // clientId is not applicable to a non-ServiceWorker context
        Object.defineProperty(this, 'clientId', {
          value: null,
          enumerable: true
        });
        // client is not applicable to a non-ServiceWorker context
        Object.defineProperty(this, 'client', {
          value: null,
          enumerable: true
        });
        Object.defineProperty(this, 'request', {
          value: request,
          enumerable: true
        });
        Object.defineProperty(this, '_resolveCallback', {
          value: null,
          writable: true
        });
        Object.defineProperty(this, '_rejectCallback', {
          value: null,
          writable: true
        });
      };

      PersistenceFetchEvent.prototype.respondWith = function (any) {
        var self = this;
        if (any instanceof Promise) {
          any.then(function (response) {
            self._resolveCallback(response);
          }, function (err) {
            self._rejectCallback(err);
          });
        } else if (typeof (any) == 'function') {
          var response = any();
          self._resolveCallback(response);
        }
      };

      PersistenceFetchEvent.prototype._setPromiseCallbacks = function (resolveCallback, rejectCallback) {
        this._resolveCallback = resolveCallback;
        this._rejectCallback = rejectCallback;
      };

      return function (input, init) {
        var request;
        // input can either be a Request object or something
        // which can be passed to the Request constructor
        if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input
        } else {
          request = new Request(input, init)
        }

        // check if it's an endpoint we care about
        return persistenceManager.getRegistration(request.url).then(function (registration) {
          if (registration != null) {
            // create a Fetch Event
            var fetchEvent = new PersistenceFetchEvent(request);
            var promise = _dispatchEvent(persistenceManager, 'fetch', fetchEvent);
            // if a promise is returned than a fetch listener(s) handled the event
            if (promise != null &&
              promise instanceof Promise) {
              return promise;
            }
          }
          // if the endpoint is not registered or the Fetch Event Listener
          // did not return a Promise then just do a regular browser fetch
          return persistenceManager.browserFetch(request);
        });
      };
    };

    return new PersistenceManager();
    /**
     * @export
     * @class PersistenceSyncManager
     * @classdesc The PersistenceSyncManager should be used support synchronization
     * capabilities for requests which were made when offline. The PersistenceSyncManager
     * instance can be obtained via the persistenceManager.getSyncManager() API. The
     * PersistenceSyncManager supports operations such as retrieving the sync log,
     * invoking the sync() API to replay the requests which were made while offline,
     * inserting/removing requests from the sync log, adding event listeners for
     * sync operations, and performing undo/redo operations for the shredded local
     * data which were made as a result of those requests.
     * @param {Function} isOnline The persistenceManager.isOnline() function
     * @param {Function} browserFetch The persistenceManager.browserFetch() function
     * @param {Function} cache The persistenceManager.getCache() function
     */
    
    /**
     * Add an event listener. The listener should always return a Promise which should resolve to either null or an object with the action field.
     * <br>
     * <p>
     * For the beforeSyncRequest event, the resolved value of the Promise returned by the listener should be one of the items given below:
     * <p>
     * <table>
     * <thead>
     * <tr>
     * <th>Resolved Value</th>
     * <th>Behavior</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td>null</td>
     * <td>Continue replaying the request</td>
     * </tr>
     * <tr>
     * <td>{action: 'replay', request: Request obj}</td>
     * <td>Replay the provided Request obj</td>
     * </tr>
     * <tr>
     * <td>{action: 'skip'}</td>
     * <td>Skip replaying the request</td>
     * </tr>
     * <tr>
     * <td>{action: 'stop'}</td>
     * <td>Stop the sync process</td>
     * </tr>
     * <tr>
     * <td>{action: 'continue'}</td>
     * <td>Continue replaying the request</td>
     * </tr>
     * </tbody>
     * </table>
     * <br>
     * For the syncRequest event, the resolved value of the Promise returned by the listener should be one of the items given below:
     * <p>
     * <table>
     * <thead>
     * <tr>
     * <th>Resolved Value</th>
     * <th>Behavior</th>
     * </tr>
     * </thead>
     * <tbody>
     * <tr>
     * <td>null</td>
     * <td>Continue processing the sync log</td>
     * </tr>
     * <tr>
     * <td>{action: 'stop'}</td>
     * <td>Stop the sync process</td>
     * </tr>
     * <tr>
     * <td>{action: 'continue'}</td>
     * <td>Continue processing the sync log</td>
     * </tr>
     * </tbody>
     * </table>
     * <br>
     * @method
     * @name addEventListener
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for.
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     */
    
    /**
     * Remove the event listener.
     * @method
     * @name removeEventListener
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for.
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     */
    
    /**
     * Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array sorted by
     * the created date of the Request
     * @method
     * @name getSyncLog
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @return {Promise} Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array of compound objects
     * which have the following structure:
     * <ul>
     * <li>requestId An internally generated unique id for the Request.</li>
     * <li>request The Request object.</li>
     * <li>undo The undo function which returns a Promise to undo the changes
     * made to the local shredded data store for the Request. The Promise will
     * resolve to true if there is undo data and false if there wasn't any.</li>
     * <li>redo The redo function which returns a Promise to redo the changes
     * made to the local shredded data store for the Request. The Promise will
     * resolve to true if there is redo data and false if there wasn't any.</li>
     * </ul>
     */
    
    /**
     * Insert a Request into the Sync Log. The position in the Sync Log the Request will be inserted at
     * is determined by the Request created date.
     * @method
     * @name insertRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {Request} request Request object
     * @param {{undoRedoDataArray: Array}} options Options
     * <ul>
     * <li>options.undoRedoDataArray optionally specify undo/redo data if this request was shredded. Should be an Array
     * whose entries should have the structure:
     * <ul>
     * <li>operation The operation performed on the local store, e.g. upsert or remove</li>
     * <li>storeName The local store name</li>
     * <li>undoRedoData An Array of compounds object with the following structure containing the undo/redo data
     * <ul>
     * <li>key The key for the shredded data row.</li>
     * <li>undo The undo data for the shredded data row.</li>
     * <li>redo The redo data for the shredded data row.</li>
     * </ul>
     * </li>
     * </ul>
     * </li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves with the Request Id when complete
     */
    
    /**
     * Delete a Request from the Sync Log
     * @method
     * @name removeRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @return {Promise} Returns a Promise which resolves to the removed Request when complete
     */
    
    /**
     * Update a Request from the Sync Log. This function effectivaly replaces the
     * Request in the sync log with the provided Request.
     * @method
     * @name updateRequest
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @param {Request} request Request object
     * @return {Promise} Returns a Promise which resolves to the replaced Request when complete
     */
    
    /**
     * Synchronize the log with the server. By default sync will first send an OPTIONS request before each request URL
     * to determine if the server is reachable. This OPTIONS request will be timed out after 60s and the sync will fail
     * with a HTTP response 504 error. If the OPTIONS request does not time out then sync will progress.
     * @method
     * @name sync
     * @memberof! PersistenceSyncManager
     * @export
     * @instance
     * @param {Object} options Options
     * <ul>
     * <li>options.preflightOptionsRequest 'enabled' or 'disabled' or url regex. 'enabled' is the default. 'disabled' will disable sending an OPTIONS request for all URLs. Specifying an URL pattern will enable the OPTIONS request only for those URLs.</li>
     * <li>options.preflightOptionsRequestTimeout The timeout for the OPTIONS request. Default is 60s.</li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves when complete
     */
     
    /**
     * @export
     * @class OfflineCache
     * @classdesc Offline Persistence Toolkit implementation of the standard
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
     * In additional to functionalities provided by the standard Cache API, this
     * OfflineCache also interacts with shredding methods for more fine-grain
     * caching.
     * @constructor
     * @param {String} name name of the cache
     * @param {Object} persistencestore instance for cache storage
     */
      
    /**
     * Retrieve the name of the cache object.
     * @method
     * @name getName
     * @memberof! OfflineCache
     * @instance
     * @return {string} Returns the name of the cache object.
     */
       
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
    
    /**
     * Bulk operation of add.
     * @method
     * @name upsertAll
     * @memberof! OfflineCache
     * @param {Array} requests An array of Request
     * @return {Promise} Returns a promise when all the requests in the array are handled.
     */

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
             
  });

