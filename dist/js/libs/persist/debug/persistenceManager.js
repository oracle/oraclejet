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
     * @hideconstructor
     * @classdesc PersistenceManager is used for offline support by acting as
     * the interface between the application, webservice, and the the Offline Persistence Toolkit.
     * The PersistenceManger is where the endpoints are registered/unregistered for Offline Persistence Toolkit.
     * In order to use PersistenceManager, a default story factory must be registered using
     * {@link PersistenceStoreManager#registerDefaultStoreFactory|registerDefaultStoreFactory} before
     * initializing PersistenceManager. PersistenceManager is not needed when Offline Persistence Toolkit
     * is operating in {@link https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API |ServiceWorker}
     * Mode. Please see {@link README|Concept section} for more infomation.
     * <br />
     * <br />
     * PersistenceManager should be {@link PersistenceManager#init|initialized} prior to using any of the other methods.
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
     * Initializes the PersistenceManager
     * and will return a promise once the PersistenceManager is ready.
     * A default story factory must be registered using
     * {@link PersistenceStoreManager#registerDefaultStoreFactory|registerDefaultStoreFactory}
     * before initializing PersistenceManager. This method is normally called when the applciation
     * is first started or when a {@link PersistenceRegistration} needs to be deregistered.
     * @method
     * @name init
     * @memberof PersistenceManager
     * @export
     * @instance
     * @return {Promise} returns a Promise when resolved that this
     *                   PersistenceManager is fully initialized.
     *
     * @example
     * PersistenceManager.init().then(function(){
     *  // Insert Your Code Here
     *  // sample code
     *  PersistenceManager.register()
     * });
     */
    PersistenceManager.prototype.init = function () {
      logger.log("Offline Persistence Toolkit PersistenceManager: Initilizing");
      _replaceBrowserApis(this);
      _addBrowserEventListeners(this);
      _openOfflineCache(this);

      return Promise.resolve();
    };

    /**
     * Force the PersistenceManager to go offline regardless of the browsers actual network status.
     * This function should be used if the user wants the application to function in offline mode.
     * When {@link PersistenceManager#isOnline|PersistenceManager.isOnline()} is called, it will
     * return false is forceOffline is set to true.
     * @method
     * @name forceOffline
     * @memberof PersistenceManager
     * @export
     * @instance
     * @param {boolean} offline If true, sets the PersistenceManager offline
     * @example <caption>Toggle Force Offline to true</caption>
     * PersistenceManager.forceOffline(true)
     * @example <caption>Toggle Force Offline to false</caption>
     * PersistenceManager.forceOffline(false)
     */
    PersistenceManager.prototype.forceOffline = function (offline) {
      logger.log("Offline Persistence Toolkit PersistenceManager: forceOffline is called with value: " + offline);
      this._forceOffline = offline;
    };

    /**
     * PersistenceManager.getCache returns the Offline Persistence Toolkit implementation of the standard Cache API.
     * In additional to functionalities provided by the standard Cache API, this OfflineCache also interacts with
     * shredding methods for more fine-grain caching and allows for a clear() function to remove the clear the cache.
     * @method
     * @name getCache
     * @memberof PersistenceManager
     * @export
     * @instance
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache | CacheAPI MDN}
     * @return {OfflineCache} returns the cache store for the Persistence Framework. Implements the Cache API.
     * @example
     * var PersisteneCache = PersistenceManager.getCache()
     * PersistenceCache.[someMethod]
     * @example
     * PersistenceManager.getCache().[someMethod]
     */
    PersistenceManager.prototype.getCache = function () {
      return this._cache;
    };

    /**
     * Checks if the browser is online. PersistenceManager can be forced into offline mode by setting
     * {@link forceOffline} to true.
     * <ul>
     * <li>Returns true if the browser AND PersistenceManager is online.</li>
     * <li>Returns false if the browser OR PersistenceManager is offline.</li>
     * </ul>
     * Note: To determine if the browser is online, the function will use
     * navigator.onLine whose behavior is browser specific. If being used
     * in a hybrid mobile application, please install the
     * {@link https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-network-information/|Cordova Network Information Plugin}.
     * Installing the plugin will enable this function to return accurate
     * browser online status.
     *
     * @method
     * @name isOnline
     * @memberof PersistenceManager
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
     * Registers a URL endpoint for persistence storage. The scope value can also be a regular expression.
     * If not options are passed in, PersistenceManager.register acts similarly to {@link PersistenceManager#getRegistrations|getRegistrations}
     * and will return a array of all registrations objects or null if none exist.
     * @method
     * @name register
     * @memberof PersistenceManager
     * @export
     * @instance
     * @param {{scope: string}=} options Options to control registration
     * <ul>
     * <li>options.scope The URI which should be persisted.</li>
     * <li>options.scope Can also be a regular expression.</li>
     * </ul>
     * @return {Promise<PersistenceRegistration|Array<PersistenceRegistration>|null>} Returns a Promise which resolves to a
     * {@link PersistenceRegistration} object for the specified options.
     * If options is null, returns an array of all current {@link PersistenceRegistration} objects
     * or null if there are none.
     *
     * @example <caption>String Scope</caption>
     * PersistenceManager.register({scope:'/location'}).then(function(registration){
     * // add event listeners for scope '/location'
     * });
     * PersistenceManager.register({scope:'oracle.com'}).then(function(registration){
     * // add event listeners for scope 'oracle.com'
     * });
     *
     * @example <caption>Regular Expression Scope</caption>
     * PersistenceManager.register({scope:'/emp/g'}).then(function(registration){
     * // add event listeners for scope '/emp/'
     * });
     *
     * @example <caption>No Options</caption>
     * PersistenceManager.register().then(function(registrationArray){
     * // Returns an array of registered objects
     * });
     * PersistenceManager.register().then(function(registration){
     * // registration is null if there are no registration objects
     * });
     */
    PersistenceManager.prototype.register = function (options) {
      options = options || {};
      var registration = new PersistenceRegistration(options['scope'], this);
      this._registrations.push(registration);

      return Promise.resolve(registration);
    };

    /**
     * Return the {@link PersistenceRegistration}  object for the given URL.
     * @method
     * @name getRegistration
     * @memberof PersistenceManager
     * @export
     * @instance
     * @param {string} url Url
     * @return {Promise<PersistenceRegistration|undefined>} Returns a Promise which resolves to the
     * {@link PersistenceRegistration} object for the URL or undefined if nothing is found.
     *
     * @example <caption>Suppose a registration was registered for '/location'</caption>
     * PersistenceManager.getRegistration('https://www.oracle.com/location/stores').then(function(registration){
     * // registration will be the registration object for '/location'
     * });
     * @example <caption>No PersistenceRegistration is registered</caption>
     * PersistenceManager.getRegistration('https://www.oracle.com/doesNotExist').then(function(registration){
     * // registration will be undefined
     * });
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
     * Return an array of {@link PersistenceRegistration} objects. Similar to {@link PersistenceManager#register|PersistenceManager.register()}
     * when no options are passed in.
     * @method
     * @name getRegistrations
     * @memberof PersistenceManager
     * @export
     * @instance
     * @return {Promise<Array<PersistenceRegistration>>} Returns a Promise which resolves to an array of
     * {@link PersistenceRegistration} objects.
     * @example
     * PersistenceManager.getRegistrations().then(function(registrationArray){
     * // Your Code Here
     * });
     */
    PersistenceManager.prototype.getRegistrations = function () {
      return Promise.resolve(this._registrations.slice());
    };

    /**
     * getSyncManager returns the {@link PersistenceSyncManager|Sync Manager} which is used to support synchronization capabilities for requests which were
     * made when offline. The PersistenceSyncManager supports operations such as retrieving the sync log, invoking the {@link PersistenceSyncManager#sync|sync()} API
     * to replay the requests which were made while offline, inserting/removing requests from the sync log, adding
     * event listeners for sync operations, and performing undo/redo operations for the shredded local data which
     * were made as a result of those requests.
     * @method
     * @name getSyncManager
     * @memberof PersistenceManager
     * @export
     * @instance
     * @return {PersistenceSyncManager} Returns the Sync Manager
     * @example
     * var syncManager = PersistenceManager.getSyncManager()
     * syncManager.[someMethod]
     * @example
     * PersistenceManager.getSyncManager().[someMethod]
     */
    PersistenceManager.prototype.getSyncManager = function () {
      return this._persistenceSyncManager;
    };

    /**
     * Call fetch API
     * without going through the persistence framework. This is the
     * unproxied browser provided fetch API.
     * @method
     * @name browserFetch
     * @memberof PersistenceManager
     * @export
     * @instance
     * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API | FetchAPI MDN}
     * @param {String|Request} request A USVString containing the direct URL of the
     * resource you want to fetch or a Request object.
     * @return {Promise<Response>} Resolves to the Response when complete
     * @example
     * PersistenceManager.browserFetch('https://www.oracle.com/').then(function(response){
     * // Your Code Here
     * });
     */
    PersistenceManager.prototype.browserFetch = function (request) {
      var self = this;
      logger.log("Offline Persistence Toolkit PersistenceManager: browserFetch() for Request with url: " + request.url);
      // only do special processing in browser context. In service worker context
      // just call regular fetch.
      var requestObj = request
      if (_isBrowserContext()) {
        // store the last Request object on the PersistenceManager so that we
        // can detect if a fetch polyfill is causing a XHR request to our
        // XHR adapter
        Object.defineProperty(this, '_browserFetchRequest', {
          value: request,
          writable: true
        });
        return new Promise(function (resolve, reject) {
          logger.log("Offline Persistence Toolkit PersistenceManager: Calling browser fetch function for Request with url: " + request.url);
          if (request._browserRequest) {
            requestObj = request._browserRequest;
          }
          self._browserFetchFunc.call(window, requestObj).then(function (response) {
            resolve(response);
          }, function (error) {
            reject(error);
          });
          self._browserFetchRequest = null;
        });
      } else {
        if (request._browserRequest) {
          requestObj = request._browserRequest;
        }
        return fetch(requestObj);
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
      self._cache = offlineCacheManager.open('systemCache');
    };

    function _replaceBrowserApis(persistenceManager) {
      // save off the browser fetch and XHR only in browser context.
      // also add listeners for browser online
      // Don't do it for Service Workers
      if (_isSafari()) {
        logger.log("Offline Persistence Toolkit PersistenceManager: Replacing Safari Browser APIs");
        // using self to refer to both the "window" and the "self" context
        // of serviceworker
        Object.defineProperty(persistenceManager, '_browserRequestConstructor', {
          value: self.Request,
          writable: false
        });
        Object.defineProperty(persistenceManager, '_persistenceRequestConstructor', {
          value: persistenceRequest(persistenceManager),
          writable: false
        });
        self['Request'] = persistenceManager._persistenceRequestConstructor;
        if (!_isBrowserContext()) {
          // replace serviceWorker's fetch with this wrapper to unwrap safari request in sw
          Object.defineProperty(persistenceManager, '_browserFetchFunc', {
            value: self.fetch,
            writable: false
          });
          self['fetch'] = serviceWorkerFetch(persistenceManager)
        }
      }

      if (_isBrowserContext() &&
        !persistenceManager._browserFetchFunc &&
        !persistenceManager._browserXMLHttpRequest) {
        // browser context
        // _browserFetchFunc is always non-null because we polyfill it
        logger.log("Offline Persistence Toolkit PersistenceManager: Replacing browser APIs");
        Object.defineProperty(persistenceManager, '_browserFetchFunc', {
          value: window.fetch,
          writable: false
        });
        Object.defineProperty(persistenceManager, '_browserXMLHttpRequest', {
          value: window.XMLHttpRequest,
          writable: false
        });
        // replace the browser fetch and XHR with our own
        window['fetch'] = persistenceFetch(persistenceManager);
        window['XMLHttpRequest'] = function () {
          if (persistenceManager._browserFetchRequest != null) {
            // this means we got invoked by a fetch polyfill. That means
            // we can just use the browser XHR since the browser doesn't
            // support the Fetch API anyway
            return new persistenceManager._browserXMLHttpRequest();
          }
          return new PersistenceXMLHttpRequest(persistenceManager._browserXMLHttpRequest);
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
     * @classdesc PersistenceRegistration constructor. This constructor is created when
     * {@link PersistenceManager#register|PersistenceManager.register API } is envoked.
     * This API is used to add eventlisteners to the registered scope or remove an existing
     * registration object from the {@link PersistenceManager}.
     * @constructor
     * @param {string} scope The URI which should be persisted
     * @param {Object} PersistenceManager
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
     * The scope for the registration. This is the unique identifier for each registration.
     * @export
     * @instance
     * @memberof PersistenceRegistration
     *
     * @type {string}
     */

    /**
     * Add an event listener for how an event will be handled. Currently, the only supported event is the "fetch" event.
     * @method
     * @name addEventListener
     * @memberof PersistenceRegistration
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for. Supported value is "fetch"
     * which will trigger the function with a FetchEvent once a fetch occurs.
     * @param {Function} listener The object that receives a notification when an event of the specified type occurs
     * @example
     * // Using Default Response Proxy
     * var ResponseProxy = defaultResponseProxy.getResponseProxy(
     *    {
     *       fetchStrategy: fetchStrategies.getCacheFirstStrategy()
     * });
     * PersistenceManager.register({scope:'/employee'}).then(function(registration){
     *    PersistenceRegistration.addEventListener('fetch',ResponseProxy.getFetchEventListener());
     * });
     * @example
     * // Using a custom event listener
     *
     * //using {@link DefaultResponseProxy#getResponseProxy|defaultResponseProxy.getResponseProxy} to set up a shreading method
     * var defaultItemResponseProxy = defaultResponseProxy.getResponseProxy(
     *   {
     *     jsonProcessor:
     *       {
     *         shredder: simpleJsonShredding.getShredder('item', 'ID'),
     *         unshredder: simpleJsonShredding.getUnshredder()
     *       },
     *     queryHandler: queryHandlers.getSimpleQueryHandler('item', 'limit')
     *   });
     * persistenceManager.register({
     *   scope: '/item'
     * }).then(function (registration) {
     *   registration.addEventListener('fetch', function (event) {
     *     // Using the event's respondWith method, return a new promise
     *     // that will resolve into the response from the persistence framework
     *     event.respondWith(new Promise(function (resolve, reject) {
     *       defaultItemResponseProxy.processRequest(event.request).then(function (response) {
     *         if (response != null) {
     *           // Check to see if the response from the cache is stale
     *           if ((new Date(response.headers.get('x-oracle-jscpt-cache-expiration-date'))).getTime() < (new Date()).getTime()) {
     *             // handle response
     *           } else {
     *             // handle stale response
     *           }
     *         }
     *         resolve(response);
     *       });
     *     }));
     *   })});
     */
    PersistenceRegistration.prototype.addEventListener = function (type, listener) {
      this._eventListeners.push({'type': type.toLowerCase(),
                                'listener': listener});
    };

    /**
     * Unregisters the registration. Will finish any ongoing operations before it is unregistered.
     * @method
     * @name unregister
     * @memberof PersistenceRegistration
     * @export
     * @instance
     * @return {Promise<Boolean>} Promise resolves with a boolean indicating whether the scope has been unregistered or not
     * <ul>
     * <li>true if successfully unregistered</li>
     * <li> false if unsuccessful</li>
     * </ul>
     * @example
     * PersistenceManager.getRegistration('https://www.oracle.com/location').then(function(registration){
     *     registration.unregister().then(function(registrationStatus){
     *      // registrationStatus is boolean based on if it was succuessful or not
     *    })
     * })
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

    function persistenceRequest(persistenceManager) {
      function PersistenceRequest(input, init) {
        var self = this;

        // create two variables to house the input and init vars
        var requestInput = input;
        var requestInit = init;
        logger.log("Offline Persistence Toolkit persistenceRequest: Create New Request");
        // Check if the input is a Request object
        if (input._input){
          logger.log("Offline Persistence Toolkit persistenceRequest: Input is a PersistenceRequest");
          // we replace the user inputs with a copy of the previous request object's input and init vars
          requestInput = input._input;
          requestInit = Object.assign({}, input._init);
          // if there are any init's for for this request, then those must also be carried over to
          // the requestInit overwriting any previous entries
          for (var key in init) {
            if (init.hasOwnProperty(key)) {
              requestInit[key]= init[key];
            }
          }
          // the headers and body must be checked for formData instance
          // if it has both exist, then the headers.get("Content-Type") must be replace
          // to preserve formData Boundary
          if (input.headers &&
            requestInit &&
            requestInit.body &&
            requestInit.body instanceof FormData) {
            // check to see if the header exist before adding, if it does only replace content-type
            if (requestInit.headers){
              var contentType = input.headers.get("Content-Type")
              requestInit.headers.set("Content-Type",contentType );
            } else {
              // else replace whole header
              requestInit.headers = input.headers;
            }
          }
        }

        this._browserRequest = new persistenceManager._browserRequestConstructor(requestInput, requestInit);
        this._input = requestInput;
        this._init = requestInit;
        var requestDefineProperty = function (requestProperty) {
          var propDescriptors = Object.getOwnPropertyDescriptor(self._browserRequest, requestProperty);

          if (propDescriptors &&
            (propDescriptors.writable ||
              propDescriptors.set)) {
            Object.defineProperty(self, requestProperty, {
              get: function () {
                return self._browserRequest[requestProperty];
              },
              set: function (value) {
                self._browserRequest[requestProperty] = value;
              },
              enumerable: true
            });
          } else {
            Object.defineProperty(self, requestProperty, {
              get: function () {
                return self._browserRequest[requestProperty];
              },
              enumerable: true
            });
          }
        }
        var property;
        for (property in this._browserRequest) {
          // cannot use typeof on the "body" property as it will result in a not implmented error
          if (property == "body" || typeof this._browserRequest[property] != "function") {
            requestDefineProperty(property);
          }
        }
        var boundary = this.headers.get("Content-Type");
        if (boundary != null &&
          boundary.indexOf("boundary=") > -1 &&
          boundary.indexOf("form-data") > -1) {
          boundary = boundary.split("boundary=")
          this._boundary = "--" + boundary[boundary.length - 1];
        }

        this.arrayBuffer = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called arrayBuffer()");
          var self = this;
          try {
            if (self._init &&
              self._init.body) {
              if (!(self._init.body instanceof FormData)) {
                return self._browserRequest.arrayBuffer();
              } else {
                return _formDataToString(self._init.body, self._boundary).then(function (formDataText) {
                  var formDataArrayBuffer = _strToArrayBuffer(formDataText);
                  return formDataArrayBuffer;
                })
              }
            }
            return self._browserRequest.arrayBuffer();
          } catch (e) {
            return Promise.reject(e);
          }
        }

        this.blob = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called blob()");
          var self = this;
          try {
            if (self._init &&
              self._init.body) {
              if (!(self._init.body instanceof FormData)) {
                return self._browserRequest.blob();
              } else {
                return _formDataToString(self._init.body, self._boundary).then(function (formDataText) {
                  var formDataBlob = new Blob([formDataText],
                    { type: self.headers.get("Content-Type") });
                  return formDataBlob;
                })
              }
            }
            return self._browserRequest.blob();
          } catch (e) {
            return Promise.reject(e);
          }
        }

        this.formData = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called formData()");
          var self = this;
          try {
            if (self._init &&
              self._init.body) {
              if (!(self._init.body instanceof FormData)) {
                return self._browserRequest.formData();
              } else {
                return Promise.resolve(self._init.body);
              }
            }
            return self._browserRequest.formData();
          } catch (e) {
            return Promise.reject(e);
          }
        }

        this.json = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called json()");
          var self = this;
          try {
            if (self._init &&
              self._init.body) {
              if (!(self._init.body instanceof FormData)) {
                return self._browserRequest.json();
              } else {
                return Promise.reject(new SyntaxError("Unexpected number in JSON at position 1"));
              }
            }
            return self._browserRequest.json();
          } catch (e) {
            return Promise.reject(e);
          }
        }

        this.text = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called text()");
          var self = this;
          try {
            if (self._init &&
              self._init.body) {
              if (!(self._init.body instanceof FormData)) {
                return self._browserRequest.text();
              } else {
                return _formDataToString(self._init.body, self._boundary);
              }
            }
            return self._browserRequest.text();
          } catch (e) {
            return Promise.reject(e);
          }
        }

        this.clone = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest: Called clone()");
          var self = this;
          if (self.headers &&
            self._init &&
            self._init.body &&
            self._init.body instanceof FormData) {
            self._init.headers = self.headers;
          }
          var clonedRequest = new PersistenceRequest(self._input, self._init);
          clonedRequest._browserRequest = self._browserRequest.clone();
          return clonedRequest;
        }
        this.toString = function () {
          logger.log("Offline Persistence Toolkit persistenceRequest:requestToString()");
          if (this._input.url){
            return this._input.url;
          } else {
            return this._input;
          }
        }
      };
      return PersistenceRequest;
    };
    // this is the minimal wrapper version of fetch which we replace the serviceworker
    // version with. We only do this in Safari's serviceworker context to unwrap our
    // wrapped requests so that there are no need to call request._browserRequest
    // The replacement is done in persistenceManager.
    function serviceWorkerFetch(persistenceManager) {
      function serviceWorkerFetchEvent(request) {
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

      serviceWorkerFetchEvent.prototype.respondWith = function (any) {
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

      serviceWorkerFetchEvent.prototype._setPromiseCallbacks = function (resolveCallback, rejectCallback) {
        this._resolveCallback = resolveCallback;
        this._rejectCallback = rejectCallback;
      };

      return function (input, init) {
        var request;
        // input can either be a Request object or something
        // which can be passed to the Request constructor
        if (Request.prototype.isPrototypeOf(input) && !init) {
          request = input;
        } else {
          request = new Request(input, init);
        }
        logger.log("Offline Persistence Toolkit serviceWorkerFetch:"+request.url);
        if (request._browserRequest) {
          request = request._browserRequest;
        }
        return new Promise(function (resolve, reject) {
          persistenceManager._browserFetchFunc.call(self, request).then(function (response) {
            resolve(response);
          }, function (error) {
            reject(error);
          });
        })
      };
    }

    function _isSafari() {
      // using the same isSafari() check as VB
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      // hybrid apps do not use "safari" in its userAgent on ios
      var isiOS =  /\((iPad|iPhone)/i.test(navigator.userAgent);
      return (isSafari || isiOS);
    };

    function _strToArrayBuffer(str) {
      // this function is used exclusively on Safari to match functionality
      // of Chrome since ArrayBuffer for FormData since it is not supported
      // arrayBuffer on Chrome uses utf-8 encoding
      var enc = new TextEncoder();
      return enc.encode(str).buffer;
    }
    function _formDataToPromise(value, key, boundary) {
      return new Promise(function (resolve, reject) {
        var entryText;
        var itemType = value.constructor.name;
        switch (itemType) {
          case "File":
            // File objects must be encoded using FileReader API since on
            // Safari blobs are basically stubs with no conversion operations
            var reader = new FileReader();
            reader.onload = function (evt) {
              entryText = '\r\n' +
                'Content-Disposition: form-data; name="' +
                key.toString() +
                '"; filename="' + value.name +
                '"\r\n' +
                'Content-Type: ' + value.type +
                '\r\n\r\n' +
                evt.target.result +
                '\r\n' +
                boundary;
              resolve(entryText)
            };
            reader.onerror = function () {
              reader.abort();
              reject(new DOMException("Problem parsing input file."));
            };
            reader.readAsText(value);
            break;
          case "String":
            entryText = '\r\n' +
              'Content-Disposition: form-data; name="' +
              key +
              '"\r\n\r\n' +
              value +
              '\r\n' +
              boundary;
            resolve(entryText);
            break;
          default:
            // If a user appends their own objects into the formData
            // using formData.set("key",{value:value}) , when it is transformed
            // into text, it results in the object appearing as [object Object]
            entryText = '\r\n' +
              'Content-Disposition: form-data; name="' +
              key.toString() +
              '"\r\n\r\n' +
              value.toString() +
              '\r\n' +
              boundary;
            resolve(entryText);
            break;
        }
      })
    }

    function _formDataToString(formData, boundary) {
      return new Promise(function (resolve, reject) {
        var promiseArray = [];
        var formDataText = boundary;
        // since fileReader is a promise based API, all formData entries
        // are converted to promise which return string versions of the entry
        // the promise.all then concatinates the strings together.
        formData.forEach(function (value, key) {
          promiseArray.push(_formDataToPromise(value, key, boundary));
        })
        Promise.all(promiseArray).then(function (entryText) {
          entryText.forEach(function (entry) {
            formDataText += entry;
          })
          formDataText += "--";
          resolve(formDataText);
        }).catch(function (err) {
          reject(err);
        })
      })
    }
    return new PersistenceManager();
    /**
     * @export
     * @class PersistenceSyncManager
     * @classdesc The PersistenceSyncManager should be used support synchronization
     * capabilities for requests which were made when offline. The PersistenceSyncManager
     * instance can be obtained via the {@link PersistenceManager#getSyncManager|persistenceManager.getSyncManager() API}. The
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
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for. Such as "beforeSyncRequest", "syncRequest", and "afterSyncRequest"
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string=} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     * @example
     * var afterRequestListener = function (event) {
     *   var statusCode = event.response.status;
     *   if (statusCode == 200) {
     *     return new Promise(function (resolve, reject) {
     *       // Handle Response Here
     *       resolve({action: 'continue'});
     *     });
     *   }
     *   return Promise.resolve({action: 'continue'});
     * }
     * PersistenceSyncManager.addEventListener('syncRequest',afterRequestListener,'/sync');
     */

    /**
     * Remove the event listener.
     * @method
     * @name removeEventListener
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {string} type A string representing the event type to listen for.
     * @param {Function} listener The function that receives a notification when an event of the specified type occurs. The function should return a Promise.
     * @param {string=} scope optional scope of the Requests. If not specified, will trigger for all Requests.
     */

    /**
     * Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array sorted by
     * the created date of the Request
     * @method
     * @name getSyncLog
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @return {Promise<Array<Request>>} Returns a Promise which resolves to all the Requests in the Sync Log returned as an Array of compound objects
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
     * @example
     * PersistenceSyncManger.getSyncLog().then(function(allRequests){
     * // Your Code Here
     * });
     */

    /**
     * Insert a Request into the Sync Log. The position in the Sync Log the Request will be inserted at
     * is determined by the Request created date.
     * @method
     * @name insertRequest
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {Request} request Request object
     * @param {{undoRedoDataArray: Array}=} options Options
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
     * @return {Promise<String>} Returns a Promise which resolves with the Request Id when complete
     * @example
     * PersistenceSyncManager.insertRequest(request).then(function(requestID){
     * // Your Code Here
     * });
     * @example
     * PersistenceSyncManager.insertRequest(request,{undoRedoDataArray:['upsert','localStore',[key,true,false]]}).then(function(requestID){
     * // Your Code Here
     * });
     */

    /**
     * Delete a Request from the Sync Log
     * @method
     * @name removeRequest
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @return {Promise<Request>} Returns a Promise which resolves to the removed Request when complete
     * @example
     * PersistenceSyncManager.removeRequest('uniqueid').then(function(removedRequest){
     * // your code here
     * });
     */

    /**
     * Update a Request from the Sync Log. This function effectivaly replaces the
     * Request in the sync log with the provided Request.
     * @method
     * @name updateRequest
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {string} requestId The unique id for the Request
     * @param {Request} request Request object
     * @return {Promise<Request>} Returns a Promise which resolves to the replaced Request when complete
     * @example
     * PersistenceSyncManager.updateRequest('uniqueID',request).then(function(oldRequest){
     * // your code here
     * });
     */

    /**
     * Synchronize the log with the server. By default sync will first send an OPTIONS request before each request URL
     * to determine if the server is reachable. This OPTIONS request will be timed out after 60s and the sync will fail
     * with a HTTP response 504 error. If the OPTIONS request does not time out then sync will progress.
     * @method
     * @name sync
     * @memberof PersistenceSyncManager
     * @export
     * @instance
     * @param {Object=} options Options
     * <ul>
     * <li>options.preflightOptionsRequest - <String,Regex> 'enabled' or 'disabled' or url regex. 'enabled' is the default. 'disabled' will disable sending an OPTIONS request for all URLs. Specifying an URL pattern will enable the OPTIONS request only for those URLs.</li>
     * <li>options.preflightOptionsRequestTimeout - <Number> The timeout for the OPTIONS request. Default is 60s.</li>
     * </ul>
     * @return {Promise} Returns a Promise which resolves when complete
     * @example
     * PersistenceSyncManager.sync().then(function(){
     * // Your code here
     * });
     * @example
     * PersistenceSyncManager.sync({preflightOptionRequest:/employee/g,preflightOptionsRequestTimeout:100})
     */

    /**
     * @export
     * @class OfflineCache
     * @classdesc Offline Persistence Toolkit implementation of the standard
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/Cache|Cache API}.
     * In additional to functionalities provided by the standard Cache API, this
     * OfflineCache also interacts with shredding methods for more fine-grain
     * caching. In addition to the Cache API, the OfflineCache also supports
     * the clear() function to clear the cache.
     * @constructor
     * @param {String} name name of the cache
     * @param {Object} persistencestore instance for cache storage
     */

    /**
     * Retrieve the name of the cache object.
     * @method
     * @name getName
     * @memberof OfflineCache
     * @instance
     * @return {string} Returns the name of the cache object.
     * @example
     * // Assume the cache name is "employee"
     * OfflineCache.getName() // returns "employee"
     */

    /**
     * Takes a request, retrieves it and adds the resulting response
     * object to the cache.
     * @method
     * @name add
     * @memberof OfflineCache
     * @instance
     * @param {Request} request The request object to fetch for response
     *                          and be cached.
     * @return {Promise} returns a Promise that is resolved when the reponse
     *                           is retrieved and request/response is cached.
     * @example
     * OfflineCache.add(request).then(function(){
     * // Your Code Here
     * });
     */

    /**
     * Clear the cache.
     * @method
     * @name clear
     * @memberof OfflineCache
     * @instance
     * @return {Promise<Boolean>} Returns a promise that resolves to true when the cache is cleared.
     * Will resolve to false if not all cache items were able to be cleared.
     * @example
     * OfflineCache.clear().then(function(isCleared){
     * // isCleared is a Boolean value
     * // Your Code here
     * });
     */

    /**
     * Bulk operation of add.
     * @method
     * @name upsertAll
     * @memberof OfflineCache
     * @param {Array} requests An array of Request
     * @return {Promise} Returns a promise when all the requests in the array are handled.
     * @example
     * OfflineCache.upsertAll([request1,request2,request3]).then(function(){
     * // Your Code here
     * });
     */

    /**
     * Find the first response in this Cache object that match the request with the options.
     * @method
     * @name match
     * @memberof OfflineCache
     * @instance
     * @param {Request} a request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}=} options Options to control the matching operation
     * <ul>
     * <li>options.ignoreSearch - A Boolean that specifies whether to ignore
     *                          the query string in the url.  For example,
     *                          if set to true the ?value=bar part of
     *                          http://foo.com/?value=bar would be ignored
     *                          when performing a match. It defaults to false.</li>
     * <li>options.ignoreMethod - A Boolean that, when set to true, prevents
     *                          matching operations from validating the
     *                          Request http method (normally only GET and
     *                          HEAD are allowed.) It defaults to false.</li>
     * <li>options.ignoreVary - A Boolean that when set to true tells the
     *                          matching operation not to perform VARY header
     *                          matching — i.e. if the URL matches you will get
     *                          a match regardless of whether the Response
     *                          object has a VARY header. It defaults to false.</li>
     * </ul>
     * @return {Promise<Response|undefined>} Returns a Promise that resolves to the Response associated with the
     *                           first matching request in the Cache object. If no match is
     *                           found, the Promise resolves to undefined.
     * @example
     * OfflineCache.match(request).then(function(response){
     * // Your code here
     * });
     * @example
     * OfflineCache.match(request,{ignoreSearch:true}).then(function(response){
     * // Your code here
     * });
     */

    /**
     * Finds all responses whose request matches the passed-in request with the specified
     * options.
     * @method
     * @name matchAll
     * @memberof OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}=} options Options to control the matching operation
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
     * @return {Promise<Array<Response>>} Returns a Promise that resolves to an array of response objects
     *                            whose request matches the passed-in request.
     * @example
     * OfflineCache.matchAll(request).then(function(responseArray){
     * // Your code here
     * });
     */

    /**
     * Add the request/response pair into the cache.
     * @method
     * @name put
     * @memberof OfflineCache
     * @instance
     * @param {Request} request Request object of the pair
     * @param {Response} response Response object of the pair
     * @return {Promise} Returns a promise when the request/response pair is cached.
     * @example
     * OfflineCache.put(request,response).then(function(){
     * // response has been cached
     * // your code here
     * });
     */

    /**
     * Delete the all the entries in the cache that matches the passed-in request with
     * the specified options.
     * @method
     * @name delete
     * @memberof OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}=} options Options to control the matching operation
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
     * @return {Promse<Boolean>} Finds the Cache entry whose key is the request, and if found,
     *                  deletes the Cache entry and returns a Promise that resolves to
     *                  true. If no Cache entry is found, it returns a Promise that
     *                  resolves to false.
     * @example
     * OfflineCache.delete(request).then(function(result){
     * // result is a boolean that based on if the .delete was able to to find and remove a cached entry.
     * });
     */

    /**
     * Retrieves all the keys in this cache.
     * @method
     * @name keys
     * @memberof OfflineCache
     * @instance
     * @param {Request} [request] The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}=} options Options to control the matching operation
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
     * @return {Promise<Array>} Returns a promise that resolves to an array of Cache keys.
     * @example
     * // with a request object passed in, it will return all keys related that that request
     * OfflineCache.keys(request).then(function(keyArray){
     * //keyArray will only contain key that match the request
     * });
     * @example
     * // without a request object, it will return all keys in the cache
     * OfflineCache.keys().then(function(allKeys){
     * // allKeys contains every key stored in the cache
     * });
     */

    /**
     * Checks if a match to this request with the specified options exist in the
     * cache or not. This is an optimization over match because we don't need to
     * query out the shredded data to fill the response body.
     * @method
     * @name hasMatch
     * @memberof OfflineCache
     * @instance
     * @param {Request} request The request object to match against
     * @param {{ignoreSearch: boolean, ignoreMethod: boolean, ignoreVary: boolean}=} options Options to control the matching operation
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
     * @return {Promise<Boolean>} Returns a promise that resolves to true if a match exist
     *                   while false otherwise.
     * @example
     * OfflineCache.hasMatch(request).then(function(matchExists){
     * //your code here
     * });
     */

  });

