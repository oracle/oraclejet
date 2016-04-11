/**
 * Copyright (c) 2014, 2016, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'knockout', 'signals', 'promise'], function(oj, ko, signals)
{

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/
/*global oj, ko, Promise, signals */

/**
 * The ojRouter module.
 */
// Wrap in a IIFE to prevents the possiblity of collision in a non-AMD scenario.
(function() {
"use strict";
/**
 * Hold the base URL.
 * Initialized using oj.Router.defaults['baseUrl'] or on the first sync() or go()
 * @private
 * @type {string}
 */
var _ojBaseUrl;
/**
 * Hold the current page, usually 'index.html'
 * @private
 * @const
 * @type {string}
 */
var _thisPage = (function() {
      var result = '',
          url = window.location.pathname;
      if (url.indexOf('.html', url.length - '.html'.length) !== -1) {
         result = url.split('/').pop();
      }

      return result;
   }());

/**
 * Hold the url adapter to be used.
 * @private
 * @type {Object}
 */
var _urlAdapter;

/**
 * The default name for the root instance.
 * @private
 * @const
 * @type {string}
 */
var _DEFAULT_ROOT_NAME = 'root';

/**
 * The name of the request param for bookmarkable data.
 * @private
 * @const
 * @type {string}
 */
var _ROUTER_PARAM = 'oj_Router=';

/**
 * Maximum size of URL
 * @private
 * @const
 * @type {number}
 */
var _MAX_URL_LENGTH = 1024;

/**
 * Flag set to true when oj.Router is initialized
 * @private
 * @type {boolean}
 */
var _initialized = false;

/**
 * Hold the leftover path when using ojModule and the child router
 * doesn't exist yet.
 * @private
 * @type {string|undefined}
 */
var _deferredPath;

/**
 * A queue to hold unprocessed transitions
 * @private
 * @type {Array.<Object>}
 */
var _transitionQueue = [];

/**
 * A promise that resolve when all transition in the queue is resolved.
 * @private
 */
var _queuePromise;

/**
 * Retrieve the part of the URL up to the last '/'
 * @private
 * @param  {!string} url
 * @return {!string}
 */
function removeLastSegment(url) {
   return url.substring(0, url.lastIndexOf('/'));
}

/**
 * Calculate the base URL, the href without the page reference at the end.
 * @private
 * @return {!string}
 */
function getBaseUrl() {
   // Remove the hash for HTML4 case
   var base = window.location.href.split('#')[0];
   // Then extract the base URL
   return removeLastSegment(base);
}

/**
 * @private
 * @return {!string}
 */
function getUrl() {
   return window.location.href;
}

/**
 * Return key/value object of query parameters.
 * @private
 * @return {!Object.<string, string>}
 */
function parseQueryParam(queryString) {
   var params = {},
       keyValPairs = [],
       pairNum,
       parts,
       key,
       value;

   if (queryString) {
      keyValPairs = queryString.split('&');
      for (pairNum in keyValPairs)
      {
         parts = keyValPairs[pairNum].split(/\=(.+)?/);
         key = parts[0];

         if (key.length) {
            if (!params[key]) {
               params[key] = [];
            }
            value = parts[1] && decodeURIComponent(parts[1].replace(/\+/g, ' '));
            params[key].push(value);
         }
      }
   }

   return params;
}

/**
 * Return the {@link oj.RouterState} object for a specific router given a state id.
 * @private
 * @param {oj.Router} router The router object.
 * @param {string} stateId The state id.
 * @return {oj.RouterState | undefined} The state object.
 */
 //
function getStateFromId(router, stateId) {
   var state;

   if (stateId && router._states) {
      oj.Assert.assertString(stateId);

      router._states.every(function(stateAt) {
         if (stateAt._id === stateId) {
            state = stateAt;
            return false;
         }
         return true;
      });
   }
   return state;
}

/**
 * Retrieve the short URL, the current URL without the base URL.
 * @private
 * @return {!string} the short URL
 */
function getShortUrl() {
   var shortUrl = getUrl().split('#')[0];

   return shortUrl.replace(_ojBaseUrl + '/', '');
}

/**
 * Retrieve a router full name. A path of all rooter name from root.
 * @private
 * @param  {!oj.Router} router
 * @return {!string}
 */
function getRouterFullName(router) {
   if (router._parentRouter) {
      return getRouterFullName(router._parentRouter) + '.' + router._name;
   }

   return router._name;
}

/**
 * Retrieve the absolute path to the current state.
 * @private
 * @param {oj.Router|undefined} router
 * @return {!string} path
 */
function getCurrentPath(router) {
   var path;

   if (router) {
      path = getCurrentPath(router._parentRouter) + router._currentState()._id + '/';
   }
   else {
      path = '/';
   }

   return path;
}

/**
 * Return the child router for a specific parent state value
 * @private
 * @param {oj.Router} router
 * @param {string|undefined} value
 * @return {oj.Router|undefined}
 */
function _getChildRouter(router, value) {
   var subRouter;

   router._childRouters.every(function(sr) {
      if (!sr._parentState || sr._parentState === value) {
         subRouter = sr;
         return false;
      }
      return true;
   });

   return subRouter;
}

/**
 * Return true if the current transition is cancelled.
 * See queuing of transaction in _queueTransaction
 * @private
 * @return {boolean}
 */
function isTransitionCancelled() {
   return (_transitionQueue[0] && _transitionQueue[0].cancel);
}

/**
 * Encode and compress the a state object. This is used for bookmarkable data.
 * @private
 * @param {!Object} extraState
 * @return {string}
 * @throws An error if bookmarkable state is too big.
 */
function encodeStateParam(extraState) {
   var jsonState = JSON.stringify(extraState),
       encodedState = encodeURIComponent(jsonState),
       compressedState = oj.LZString.compressToEncodedURIComponent(jsonState),
       useCompressed = false,
       param = _ROUTER_PARAM;

   if (compressedState.length <= encodedState.length) {
      useCompressed = true;
   }

   if (useCompressed) {
      param += '1' + compressedState;
   }
   else {
      param += '0' + encodedState;
   }

   if (param.length > _MAX_URL_LENGTH) {
      throw new Error('Size of bookmarkable data is too big.');
   }

   return param;
}

/**
 * Decompress and decode the state param from the URL.  This is used for bookmarkable data.
 * @param {!string} param
 * @throws An error if parsing fails or format is invalid.
 */
function decodeStateParam(param) {
   // First character is the compression type. Right now only 0 and 1 are supported.
   // 0 for no compression, 1 for LZW
   var compressionType = param.charAt(0);

   param = param.slice(1);

   if (compressionType === '0') {
      param = decodeURIComponent(param);
   }
   else if (compressionType === '1') {
      param = oj.LZString.decompressFromEncodedURIComponent(param);
   }
   else {
      throw new Error('Error retrieving bookmarkable data. Format is invalid');
   }

   return JSON.parse(param);
}

/**
 * Build the state param and add it to the URL.
 * @param {!string} url the url to which the param will be added
 * @param {Object} extraState the object to be stored in the param
 * @return {string} the URL with the state param
 */
function addStateParam(url, extraState) {
   if (extraState && Object.getOwnPropertyNames(extraState).length > 0) {
      var sep;
      if (url.indexOf('?') === -1) {
         sep = '?';
      }
      else {
         sep = '&';
      }

      url +=  sep + encodeStateParam(extraState);
   }

   return url;
}

/**
 * Traverse all the child routers in order to find a router that has the
 * state id given as an argument.
 * @private
 * @param  {!oj.Router} router
 * @param  {!string} sId
 * @param  {string=} parentStateId
 * @return {oj.Router|undefined}
 */
function _findRouterForStateId(router, sId, parentStateId) {
   var result;

   router._childRouters.every(function(child) {
      if ((!child._parentState || child._parentState === parentStateId) &&
          child.stateFromIdCallback(sId)) {
         result = child;
         return false;
      }
      return true;
   });

   return result;
}

/**
 * Build an array of current states for the tree of routers from root to leaf
 * @param  {oj.Router} router
 */
function buildSelected(router) {
   var states = [];

   if (router._currentState()) {
      states.push({router: router, stateId: router._stateId() });

      router._childRouters.forEach(function(child){
         states = states.concat(buildSelected(child));
      });
   }

   return states;
}

/**
 * Dispatch the transitionedToState signal
 * @private
 * @param {{hasChanged:boolean}} param
 */
function dispatchTransitionedToState(param) {
   oj.Router._transitionedToState.dispatch(param);
}

/**
 * Build an array of objects by visiting the parent hierarchy.
 * Each element of the array represent the state of a router.
 * @param {!oj.Router} router
 * @param {!string} path
 * @return {Array.<{router:oj.Router, stateId:string}>}
 */
function _buildState(router, path) {
   var newStates = [],
       routers = [],
       rt = router,
       parts = path.split('/'),
       i, sId, parent, parentStateId, canDefault;

   // Since path is absolute, it always starts with '/', so remove the first
   // element (empty string)
   parts.splice(0, 1);

   // Build an array of routers, from the root to the current one.
   while (rt) {
      routers.unshift(rt);
      rt = rt._parentRouter;
   }

   // Traverse path and routers simultaneously.
   while (sId = parts.shift()) {
      rt = routers.shift();

      if (!rt) {
         rt = _findRouterForStateId(parent, sId, parentStateId);

         // Router doesn't exist, save deferredPath and stop
         if (!rt) {
            _deferredPath = path;
            break;
         }
      }
      else {
         if (!rt.stateFromIdCallback(sId)) {
            throw new Error('Invalid path "' + path +
                  '". State id "' + sId + '" does not exist on router "' +
                     rt._name + '".');
         }
      }

      newStates.push({
         router: rt,
         stateId: sId
      });
      parent = rt;
      parentStateId = sId;
   }

   // If a default state is defined, simplify the URL by removing param
   canDefault = true;
   for (i = newStates.length - 1; (i >= 0) && canDefault; i--) {
      if (newStates[i].stateId === newStates[i].router._defaultStateId) {
         newStates[i].stateId = null;
      }
      else {
         canDefault = false;
      }
   }

   return newStates;
}

/**
 * Traverse the child router and build and array of promise for each canExit callback.
 * If the router doesn't have a canExit callback, make a promise resolved to true.
 * If the callback is not a promise, make a promise resolved to the value returned by the callback.
 * @private
 * @param {oj.Router} router
 * @param {!Array} promisesArray - Array of promises.
 * @return {boolean} - false if one of the callback returned false.
 */
function _buildAllCanExitPromises(router, promisesArray) {
   var canExit = true,
       promise = Promise.resolve(true),
       currentState = router._currentState(),
       canExitCallback, result,
       i;

   if (currentState) {
      // Traverse each child router and ask for canExit
      for (i = 0; i < router._childRouters.length; i++) {
         // 
         canExit = _buildAllCanExitPromises(router._childRouters[i], promisesArray);
         // Quick way out
         if (!canExit) {
            return false;
         }
      }

      // A callback defined on bound viewModel has precedence.
      if (currentState.viewModel && currentState.viewModel['canExit']) {
         canExitCallback = currentState.viewModel['canExit'];
      } else {
         canExitCallback = currentState._canExit;
      }

      if (typeof canExitCallback === 'function') {
         try {
            // 
            result = canExitCallback();
         }
         catch (err) {
            oj.Logger.error('Error when executing canExit callback: %s', err.message);
            return false;
         }

         if (result && result.then) {
            promise = result;
         }
         else {
            if (!result) {
               oj.Logger.info('canExit is false for state %s', currentState._id);
            }
            canExit = result;
         }
      }
   }

   promisesArray.push(promise);

   return canExit;
}

/**
 * Invoke canExit callbacks in a deferred way.
 * @param {oj.Router} router
 */
function _canExit(router) {
   var allPromises, canExit;

   if (!router) {
      return Promise.resolve(!isTransitionCancelled());
   }

   allPromises = [];
   canExit = _buildAllCanExitPromises(router, allPromises);

   if (!canExit) {
      return Promise.resolve(false);
   }

   return Promise.all(allPromises).then(function(results) {
      var i;

      for (i = 0; i < results.length; i++) {
         if (!results[i]) {
            oj.Logger.info('CanExit promise at position %s returned false.', String(i));
            return false;
         }
      }

      return (!isTransitionCancelled());
   });
}

/**
 * Return a promise resolving to true if can transition to new state in allChanges
 * @param {!Array.<{value:string, router:!oj.Router}>} allChanges
 * @param {string=} origin
 */
function _canEnter(allChanges, origin) {
   oj.Logger.info('Start _canEnter.');

   var canEnter = true,
       promise = Promise.resolve(true),
       allPromises = [];

   allChanges.every(function(change) {
      var canEnterCallback,
          newState,
          result;

      newState = change.router.stateFromIdCallback(change.value);

      // It is allowed to transition to an undefined state, but no state
      // callback need to be executed.
      if (newState) {
         canEnterCallback = newState._canEnter;

         // Check if we can enter this new state by executing the callback.
         // If it is a promise, add it to the array to be resolved later.
         // If it is a boolean, break if it is false.
         if (typeof canEnterCallback === 'function') {
            // 
            try {
               result = canEnterCallback();
            }
            catch (err) {
               oj.Logger.error('Error when executing canEnter callback: %s', err.message);
               canEnter = false;
               return false;
            }
            if (result && result.then) {
               promise = result;
            }
            else {
               canEnter = result;
               if (!canEnter) {
                  oj.Logger.info('canEnter is false for state: %s', newState._id);
                  return false;
               }
            }
         }
      }

      allPromises.push(promise);
      return true;
   });

   if (!canEnter || isTransitionCancelled()) {
      return Promise.resolve({ allChanges: [] });
   }

   return Promise.all(allPromises).then(function(results) {
      var i;
      for (i = 0; i < results.length; i++) {
         if (!results[i]) {
            oj.Logger.info('CanEnter promise at position %s returned false.', String(i));
            return { allChanges: [] };
         }
      }

      return { allChanges: allChanges, origin: origin };
   });
}

/**
 * Update the state of a router with the new value.
 * @private
 * @param {{value:string, router:!oj.Router}} change
 * @param {string | undefined} origin
 */
function _update(change, origin) {
   var oldState = change.router.stateFromIdCallback(change.router._stateId()),
       newState = change.value ? change.router.stateFromIdCallback(change.value) : undefined;

   return Promise.resolve().
      then(function() {
         oj.Logger.info('Updating state of %s to %s.', getRouterFullName(change.router), change.value);
      }).
      // Execute exit on the current state
      then(oldState ? oldState._exit : undefined).
      then(function() {
         var rt = change.router,
             i, length, goingBackward;

         // Are we going back to the previous state?
         if (origin === 'popState') {
            length = rt._navHistory.length;
            // Are we going back to the previous state?
            for (i = length-1; i >= 0; i--) {
               if (rt._navHistory[i] === change.value) {
                  goingBackward = true;
                  // Delete all elements up the one matching
                  rt._navHistory.splice(i, length - i);
                  break;
               }
            }

            // Back only if going back 1
            if ((length - i) === 1) {
               rt._navigationType = 'back';
            }
         }

         if (!goingBackward) {
            delete rt._navigationType;
            rt._navHistory.push(rt._stateId());
         }

         // Change the value of the stateId
         rt._stateId(change.value);
      }).
      // Execute enter on the new state
      then(newState ? newState._enter : undefined);
}

/**
 * Update the state of all routers in the change array.
 * @param {Object} updateObj
 */
function _updateAll(updateObj) {
   var sequence;

   sequence = Promise.resolve().then(function() {
      oj.Logger.info('Entering _updateAll.');
      oj.Router._updating = true;
   });

   updateObj.allChanges.forEach(function(change) {
      sequence = sequence.then(function() {
         if (!isTransitionCancelled()) {
            return _update(change, updateObj.origin);
         }
      });
   });

   return sequence.then(function() {
      var hasChanged = (updateObj.allChanges.length > 0) && (!isTransitionCancelled());
      oj.Router._updating = false;
      oj.Logger.info('_updateAll returns %s.', String(hasChanged));
      return { 'hasChanged': hasChanged };
   }, function(error) {
      oj.Router._updating = false;
      return Promise.reject(error);
   });
}

/**
 *
 * @param {!string} url
 * @return {!Array.<{value:string, router:!oj.Router}>}
 * @throws Error when parsing of query param fails.
 */
function _parseUrlAndCompare(url) {
   var extra = {}, name,
       search = url.split('?')[1] || '',
       allChanges, reducedChanges;

   oj.Logger.info('Parsing: %s', url);
   url = _urlAdapter.cleanUrl(url);

   // Retrieve the extra state from request param oj_Router
   var stateStr = search.split(_ROUTER_PARAM)[1];
   if (stateStr) {
      stateStr = stateStr.split('&')[0];
      extra = decodeStateParam(stateStr);
   }

   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      oj.Logger.info('Bookmarkable data: ');
      for (name in extra) {
         oj.Logger.info('   { router: %s, value: %s }', name, extra[name]);
      }
   }

   allChanges = _urlAdapter.parse(url);
   reducedChanges = allChanges.filter(function(change) {
      // Update the bookmarkable data
      var ex = extra[change.router._name];
      if (ex) {
         change.router._extra = ex;
      }

      // Only keep changes where the value doesn't match the router state
      return (change.value !== change.router._stateId());
   });

   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      oj.Logger.info('Potential changes are: ');
      reducedChanges.forEach(function(change) {
         oj.Logger.info('   { router: %s, value: %s }',
                        getRouterFullName(change.router),
                        change.value);
      });
   }

   return reducedChanges;
}

/**
 * Use to update the state with the given URL.
 * Parse the new URL and update state.
 * @param {!string} url
 * @param {string=} origin
 */
function parseAndUpdate(url, origin) {
   var allChanges;

   try {
      allChanges = _parseUrlAndCompare(url);
   }
   catch (error) {
      return Promise.reject(error);
   }

   return _canEnter(allChanges, origin).then(_updateAll);
}

/**
 * Execute a transition. There are 3 types of transitions depending if they are
 * called from go, sync or handlePopState.
 * @private
 * @param  {Object} transition An object with properties describing the transition.
 * @return A Promise that resolves when the router is done with the state transition.
 */
function _executeTransition(transition) {
   oj.Logger.info('>> Executing: path=%s, url=%s, origin=%s', transition.path,
      transition.url, transition.origin);

   if (transition.url !== undefined) {
      // if the transition originate from a sync call, don't call canExit
      if (transition.origin === 'sync') {
         return parseAndUpdate(transition.url);
      }
      return _canExit(transition.router).then(function (canExit) {
         if (canExit) {
            return parseAndUpdate(transition.url, transition.origin);
         }
         return { 'hasChanged': false };
      });
   }
   return transition.router._go(transition.path || null, transition.replace);
}

/**
 * Executes first transition on the queue then unqueue then recurse.
 * @private
 */
function _resolveTransition() {
   var transition = _transitionQueue[0],
       promise;

   oj.Logger.info('>> Resolving: path=%s, url=%s', transition.path, transition.url);

   if (transition.cancel) {
      oj.Logger.info('>> Cancelled: path=%s, url=%s', transition.path, transition.url);
      promise = Promise.resolve({ 'hasChanged': false });
   }
   else {
      promise = _executeTransition(transition);
   }

   return promise.then(function(params) {
      var done = _transitionQueue.shift();
      oj.Logger.info('>> Done with: path=%s, url=%s', done.path, done.url);
      dispatchTransitionedToState(params);
      return params;
   }, function(error) {
      _transitionQueue = [];
      dispatchTransitionedToState({ 'hasChanged': false });
      return Promise.reject(error);
   });
}

/**
 * Queue a transition. It will execute as soon as previous transitions in the
 * queue are done.
 * @private
 * @param  {Object} transition An object with properties describing the transition
 * @return A Promise that resolves when the router is done with the given state transition.
 */
function _queueTransition(transition) {
   var lastTransition, length;

   // Push new transition at the end. Current transition is always at index 0
   length = _transitionQueue.push(transition);
   oj.Logger.info('>> Queue transition for path=%s, url=%s', transition.path, transition.url);

   // Simple case when the transition is the only one in the queue.
   if (length === 1) {
      _queuePromise = _resolveTransition();
   }
   // Cancel transition in queue and chain it
   else {
      lastTransition = _transitionQueue[length-2];
      // Don't cancel transitions from popstate event or for deferred path
      if (!lastTransition.url && !lastTransition.deferredHandling) {
         oj.Logger.info('>> Cancelling: path=%s', lastTransition.path);
         lastTransition.cancel = true;
      }
      _queuePromise = _queuePromise.then(_resolveTransition);
   }

   return _queuePromise;
}

// 
/**
 * @class
 * @requires ojs/ojcore
 * @requires knockout
 * @since 1.1.0
 * @classdesc
 * <h3>JET Router</h3>
 * <p>The router is designed to simplify writing navigation for Single Page Applications.
 * The approach taken is to think of navigation in terms of states and transitions instead
 * of URLs and hashes. A router is always in one in a number of possible states and when
 * a UI action is taken in the application, a transition between states is executed. The
 * router is responsible to properly format the URL to reflect the current state and to
 * restore the application to the matching state when the URL changes.
 * <p>Building navigation is done in three steps:
 * <h6>Define the states that can be taken by the router:</h6>
 * <pre class="prettyprint"><code>
 * var router = oj.Router.rootInstance;
 * // Add three states to the router with id 'home', 'book' and 'tables
 * router.configure({
 *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
 *    'book':   { label: 'Book',   value: 'bookContent' },
 *    'tables': { label: 'Tables', value: 'tablesContent' }
 * });
 *
 * var viewModel = {
 *    router: router
 * };
 *
 * oj.Router.sync().then(
 *    function() {
 *       ko.applyBindings(viewModel);
 *    },
 *    function(error) {
 *       oj.Logger.error('Error when starting router: ' + error.message);
 *    });
 * </code></pre>
 *
 * <h6>Trigger a state transition when user ask to navigate:</h6>
 * <pre class="prettyprint"><code>
 * &lt;div id="routing-container">
 *    &lt;div id='buttons-container' data-bind="foreach: router.states">
 *      &lt;!-- Use the go function of the state as the handler for a click binding -->
 *      &lt;input type="button"
 *             data-bind="click: go,  attr: {id: id},
 *             ojComponent: {component: 'ojButton', label: label}"/>
 *    &lt;/div>
 * &lt;/div>
 * </code></pre>
 *
 * <h6>Listen to the state change and updates the dependent parts:</h6>
 * <pre class="prettyprint"><code>
 * &lt;!-- Display the content of the current state -->
 * &lt;h2 id="pageContent" data-bind="text: router.currentValue"/>
 * </code></pre>
 *
 * @desc
 * A Router cannot be instantiated. A static Router is created when the module is loaded and can be
 * accessed using the method {@link oj.Router.rootInstance|rootInstance}.
 * A child router can be created using the method {@link oj.Router#createChildRouter|createChildRouter}.
 * @see oj.Router.rootInstance
 * @see oj.Router#createChildRouter
 * @constructor
 * @export
 */
oj.Router = function(key, parentRouter, parentState) {
   var router = this;

   /**
    * A string identifier of the router. It is required the name is unique within all the
    * sibling routers.
    * @name oj.Router#name
    * @member
    * @readonly
    * @type {!string}
    * @see oj.Router#createChildRouter
    */
   this._name = key;

   /**
    * The state of the parent router when this router is current.
    * @private
    * @type {!string | undefined}
    */
   this._parentState = parentState || (parentRouter ? parentRouter._stateId() : undefined);

   /**
    * The parent router. Root router doesn't have one.
    * @private
    * @type {oj.Router | undefined}
    */
   this._parentRouter = parentRouter;

   /**
    * Array of child router.
    * @private
    * @type {Array.<oj.Router>}
    */
   this._childRouters = [];

   /**
    * Used to store the bookmarkable data.
    * @private
    * @type {Object|undefined}
    */
   this._extra = undefined;

   /**
    * A Knockout observable for the id of the current state of the router.
    * @private
    */
   this._stateId = ko.observable();

   /**
    * A Knockout observable for the id of the current state.<br>
    * <code class="prettyprint">stateId()</code> returns the string id.<br>
    * <code class="prettyprint">stateId('book')</code> transitions the router to
    * the state with id 'book'.<br>
    * It is convenient to use the stateId observable when working with component
    * with 2-way binding like {@link oj.ojButtonset#checked|checked} for
    * <code class="prettyprint">ojButtonset</code> or
    * {@link oj.ojNavigationList#selection|selection} for
    * <code class="prettyprint">ojNavigationList</code> because it does not
    * require a click on optionChange handler (See example below).
    * @name oj.Router#stateId
    * @type {function(string=): string}
    * @readonly
    *
    * @example <caption>A buttonSet using the router stateId for 2-way binding:</caption>
    * &lt;div data-bind="ojComponent: { component: 'ojButtonset',
    *                                checked: router.stateId,
    *                                focusManagement:'none' }"&gt;
    *    &lt;!-- ko foreach: router.states --&gt;
    *       &lt;label data-bind="attr: {for: id}"&gt;&lt;/label&gt;
    *       &lt;input type="radio" name="chapter"
    *              data-bind="value: id, attr: {id: id},
    *                         ojComponent: { component: 'ojButton',
    *                                        label: label}"/&gt;
    *    &lt;!-- /ko --&gt;
    * &lt;/div&gt;
    *
    */
   this._stateIdComp = ko.pureComputed({
      'read': function() {
         return this._stateId();
      },
      'write': function(value) {
         this.go(value).then(
            null,
            function(error) {
               throw error;
            });
      },
      'owner': router
   });

   /**
    * An array of all the possible states of the router. This array is null if the router is configured
    * using a callback.
    * @name oj.Router#states
    * @type {Array.<oj.RouterState>|null}
    * @readonly
    * @see oj.RouterState
    */
   this._states = null;

   /**
    * The state id of the default state for this router. The value is set when
    * {@link oj.Router#configure|configure} is called on the router and the state isDefault property is true.
    * If it is undefined, the router will start without a state selected.
    * This property is writable and can be used to set the default state id when
    * the router is configured using a callback.
    * @name oj.Router#defaultStateId
    * @type {string|undefined}
    */
   this._defaultStateId = undefined;

   /**
    * A Knockout observable on the current {@link oj.RouterState|RouterState} object.
    * @name oj.Router#currentState
    * @type {function():(oj.RouterState|undefined)}
    * @readonly
    *
    * @example <caption>Hide a panel when the state of the router is not yet defined:</caption>
    *    &lt;div data-bind="if: router.currentState()"&gt;
    *       &lt;!-- content of the panel --&gt;
    *    &lt;/div&gt;
    */
   this._currentState = ko.pureComputed(function() {
         return ko.ignoreDependencies(router.stateFromIdCallback, router, [router._stateId()]);
      });

   /**
    * A Knockout observable on the value property of the current state.<br>
    * The state value property is the part of the state object that will be used in the application.
    * It is a shortcut for <code class="prettyprint">router.currentState().value;</code>
    * @name oj.Router#currentValue
    * @type {function()}
    * @readonly
    *
    * @example <caption>Display the content of the current state:</caption>
    * &lt;h2 id="pageContent" data-bind="text: router.currentValue"/&gt;
    */
   this._currentValue = ko.pureComputed(function() {
         var retValue;
         var currentState = ko.ignoreDependencies(router.stateFromIdCallback, router, [router._stateId()]);
         if (currentState) {
            retValue = currentState.value;
         }
         return retValue;
      });

   /**
    * Used for the moduleNavigation that take direction
    * @private
    * @type {string|undefined}
    */
   this._navigationType = undefined;

   /**
    * Keep track for history to managed the animation direction
    * @private
    * @type {Array}
    */
   this._navHistory = [];

   /**
    * An object used to pass Router information to ojModule in the moduleConfig
    * object.
    * @ignore
    * @constructor
    */
   function _RouterParams() {
      Object.defineProperties(this, {
         'parentRouter': {
            value: router,
            enumerable: true
         },
         'direction': {
            get: function () {
               return router._navigationType;
            },
            enumerable: true
         }
      });
   }

   /**
    * An object to simplify integration between ojRouter and ojModule.
    * Use this object to configure an ojModule where the module name is the router
    * state. When the router changes state, ojModule will automatically load and
    * render the content of a new module based on the name specified in the
    * {@link oj.RouterState#value|value} or {@link oj.RouterState#id|id} property
    * of the current {@link oj.RouterState|RouterState}.<br>
    * The object moduleConfig provide the following functionality to the ojModule binding:
    * <ol>
    *   <li>it defines the name of the module by setting the <code class="prettyprint">name</code>
    * option to the value of the current router state.</li>
    *   <li>it makes the parent router accessible to the module using the
    * <code class="prettyprint">params['ojRouter']['parentRouter']</code> property.</li>
    *   <li>it defines a direction hint that can be use for the module animation.</li>
    *   <li>it makes the callback <code class="prettyprint">canExit</code> invokable on the
    * viewModel. If <code class="prettyprint">canExit</code> is not defined on the viewModel,
    * it will be invoked on the {@link oj.RouterState|RouterState}</li>
    * </ol>
    * The moduleConfig object has the following properties:
    * <ul>
    *   <li><code class="prettyprint">name</code>: is set to the {@link oj.RouterState#value|value}
    * property of the current state of the router.  If a current state is not defined, the default
    * state is used and if the default state is not defined, the first state is used. On the
    * state object, if the <code class="prettyprint">value</code> is not defined or if it is
    * not a string, the {@link oj.RouterState#id|id} property is used.</li>
    *   <li><code class="prettyprint">params</code>: an object with a property named
    * <code class="prettyprint">ojRouter</code> which value is a object with two properties
    * <code class="prettyprint">parentRouter</code> which value is the parent router and
    * <code class="prettyprint">direction</code> which value is undefined or the string 'back'. In
    * JET version 1.1, the parent router was the entire params object making it impossible to pass
    * any other parameters. Application built using version 1.1 of JET now need to retrieve
    * the parent router from the <code class="prettyprint">ojRouter.parentRouter</code> property of
    * <code class="prettyprint">params</code>.</li>
    *   <li><code class="prettyprint">lifecycleListener</code>: an object implementing the attached
    * callback to bind canExit to the router if it is defined on the viewModel.</li>
    * </ul>
    *
    * The router calculate the direction of the navigation and make it available to the child module
    * using the parameter <code class="prettyprint">ojRouter.direction</code>.<br> This can be used
    * to specify a different module animation when going 'back'. The value of direction is either
    * undefined or 'back'. It is 'back' when the state transition is caused by a back button on the
    * browser and the new state is equal to the previous state.

    * To customize the behavior of the moduleduleConfig object, it is possible to create your own
    * moduleConfig and merge other properties or modifies the value of existing properties.
    * It is recommended to use $.extend as described in the third example below.
    *
    * @name oj.Router#moduleConfig
    * @readonly
    *
    * @example <caption>Configure an ojModule binding with a router</caption>
    * &lt;!-- This is where your main page content will be loaded --&gt;
    * &lt;div id="mainContainer" data-bind="ojModule: router.moduleConfig"&gt;&lt;/div&gt;
    *
    * @example <caption>Creates a child router in the viewModel of a module</caption>
    * var viewModel = {
    *    initialize: function(params) {
    *       // Retrieve the parent router from the parameters
    *       var parentRouter = params.valueAccessor().params['ojRouter']['parentRouter'];
    *       // Create a child router for this viewModel
    *       this.router = parentRouter.createChildRouter('chapter')
    *          .configure({
    *             'preface':  { label: 'Preface',   value: storage['preface']  },
    *             'chapter1': { label: 'Chapter 1', value: storage['chapter1'] },
    *             'chapter2': { label: 'Chapter 2', value: storage['chapter2'] },
    *             'chapter3': { label: 'Chapter 3', value: storage['chapter3'] }
    *          });
    *       oj.Router.sync();
    *    },
    *
    *    // canExit callback will be called here
    *    canExit: function() {
    *       return (okToExit) ? true: false;
    *    }
    * };
    *
    * @example <caption>Creates a custom moduleConfig replacing the name property</caption>
    * dynamicConfig = ko.pureComputed(function () {
    *    if (smallOnly()) {
    *       // Add the prefix 'phone/' to change the viewModel location
    *       return $.extend({},
    *                       router.moduleConfig,
    *                       {name: 'phone/' + router.moduleConfig.name()});
    *    }
    *    return router.moduleConfig;
    * });
    */
   this._moduleConfig = Object.create(null, {
      'name': {
         value: ko.pureComputed(function() {
            var retValue, stateId, currentState;

            // ojModule name cannot afford to be null
            stateId = this._stateId() || this._defaultStateId || this._states[0];
            currentState = this.stateFromIdCallback(stateId);
            if (currentState) {
               retValue = currentState.value;
               if (!retValue || (typeof retValue !== 'string')) {
                  retValue = currentState._id;
               }
            }
            return retValue;
         }, router),
         enumerable: true
      },

      'params': {
         value: Object.create(null, {
            'ojRouter': {
               value: new _RouterParams(),
               enumerable: true
            }
         }),
         enumerable: true
      },

      'lifecycleListener': {
         value: Object.create(null, {
            'attached': {
               value: function(params) {
                  // Retrieve router passed as a parameter to ojModule using params defined above.
                  var paramRouter = params['valueAccessor']()['params']['ojRouter']['parentRouter'],
                      state = paramRouter._currentState();
                  if (state) {
                     state.viewModel = params['viewModel'];
                  }
               }
            }
         }),
         enumerable: true
      }
   });

   Object.defineProperties(this, {
      'parent': { value:
         /**
          * The parent router if it exits.
          * Only the 'root' router does not have a parent router.
          * @name oj.Router#parent
          * @member
          * @type {oj.Router|undefined}
          * @readonly
          */
         (this._parentRouter), enumerable: true
      }
   });

};

Object.defineProperties(oj.Router.prototype, {
   'name': { get: function () { return this._name; }, enumerable: true },
   'states': { get: function () { return this._states; }, enumerable: true },
   'stateId': { get: function () { return this._stateIdComp; }, enumerable: true },
   'currentState': { get: function () { return this._currentState; }, enumerable: true },
   'currentValue': { get: function () { return this._currentValue; }, enumerable: true },
   'defaultStateId': { get: function () { return this._defaultStateId; },
                       set: function(newValue) { this._defaultStateId = newValue; },
                       enumerable: true },
   'moduleConfig': { get: function () { return this._moduleConfig; }, enumerable: true }
});

/**
 * Create the instance of the root router.
 * @private
 * @const
 * @type {oj.Router}
 */
var rootRouter = new oj.Router(_DEFAULT_ROOT_NAME, undefined, undefined);

/**
 * Function use to handle the popstate event.
 */
function handlePopState() {
   var i,
       sr,
       subRouter = null;

   oj.Logger.info('Handling popState event with URL: %s', window.location.href);

   // First retrieve the sub-router associated with the current state, if there is one.
   for (i = 0; i < rootRouter._childRouters.length; i++) {
      sr = rootRouter._childRouters[i];
      if (rootRouter._stateId() && rootRouter._stateId() === sr._parentState) {
         subRouter = sr;
         break;
      }
   }

   _queueTransition({ router: subRouter, url: getShortUrl(), origin: 'popState' }).
   then(null, function(error) {
      oj.Logger.error('Error while changing state in handlePopState: %s', error.message);
   });
}

/**
 * Return a child router by name.
 * @param  {!string} name The name of of the child router to find
 * @return {oj.Router|undefined} The child router
 * @since 1.2.0
 * @export
 */
oj.Router.prototype.getChildRouter = function(name) {
   var childRouter;

   if (name && (typeof name === 'string')) {
      name = name.trim();
      if (name.length > 0) {
         this._childRouters.every(function(sr) {
            if (sr._name === name) {
               childRouter = sr;
               return false;
            }
            return true;
         });
      }
   }

   return childRouter;
};

/**
 * Create a child router with the given name. A router can either have one child router that handle
 * all possible states or one child router per state. In the first scenario, the child router
 * is not attached to a specific state of the parent and needs to be configured dynamically. In the
 * second scenario, a child router is attached to a specific state of the parent. If the id of
 * the parent state is not specified using the parentState argument, the child router is attached
 * to the current state of the router.
 * @param {!string} name The unique name representing the router.
 * @param {string=} parentStateId The id of the state of the parent router for this child router. If
 * not defined, the child router is created for the current state of the router.
 * @return {oj.Router} the child router
 * @throws An error if a child router exist with the same name or if the current
 * state already has a child router.
 * @export
 * @example <caption>Create a child router of the root:</caption>
 * router = oj.Router.rootInstance;
 * childRouter = router.createChildRouter('chapter');
 * @example <caption>Create a child router for parent state id 'book':</caption>
 * router = oj.Router.rootInstance;
 * childRouter = router.createChildRouter('chapter', 'book');
 */
oj.Router.prototype.createChildRouter = function(name, parentStateId) {
   var i,
       sr,
       childRouter;

   oj.Assert.assertString(name);

   parentStateId = parentStateId||this._stateId();

   name = encodeURIComponent(name.trim());
   // Make sure it doesn't already exist.
   for (i = 0; i < this._childRouters.length; i++) {
      sr = this._childRouters[i];
      if (sr._name === name) {
         throw new Error('Invalid router name "' + name + '", it already exists.');
      }
      else if (sr._parentState === parentStateId) {
         throw new Error('Cannot create more than one child router for parent state id "' + sr._parentState + '".');
      }
   }

   childRouter = new oj.Router(name, this, parentStateId);

   this._childRouters.push(childRouter);

   return childRouter;
};

/**
 * @private
 * @param {string} stateId The state id.
 * @return {oj.RouterState | undefined} The state object.
 */
oj.Router.prototype.stateFromIdCallback = function(stateId) {
   return getStateFromId(this, stateId);
};

/**
 * Configure the states of the router. The router can be configured in two ways:
 * <ul>
 *  <li>By describing all of the possible states that can be taken by this router.</li>
 *  <li>By providing a callback returning a {@link oj.RouterState|RouterState}
 *      object given a string state id.</li>
 * </ul>
 * This operation reset any previous configuration.<br>
 * This operation is chainable.
 * @param {!(Object.<string, {label: string, value, isDefault: boolean}> |
 *         function(string): (oj.RouterState | undefined)) } option
 * Either a callback or a dictionary of states.
 * <h6>A callback:</h6>
 * <h4 id="stateFromIdCallback" class="name">
 *    stateFromIdCallback
 *    <span class="signature">(stateId)</span>
 *    <span class="type-signature">
 *       → {<a href="oj.RouterState.html">oj.RouterState</a>|undefined}
 *    </span>
 * </h4>
 * A function returning a {@link oj.RouterState|RouterState} given a string state id.<br>
 * When using a callback, the {@link oj.Router.states|states} property will always be null since
 * states are defined on the fly.<br>See second example below.
 * <h6>A dictionary of states:</h6>
 * It is a dictionary in which the keys are state {@link oj.Router#id|id}s and values are objects
 * defining the state.<br>See first example below.
 * <h6>Key</h6>
 * <table class="params">
 *   <thead><tr>
 *     <th>Type</th>
 *     <th class="last">Description</th>
 *   </tr></thead>
 *   <tbody>
 *     <tr>
 *       <td class="type">
 *         <span class="param-type">string</span>
 *       </td>
 *       <td class="description last">the state id.
 *       See the RouterState <a href="oj.RouterState.html#id">id</a> property.</td>
 *    </tr>
 *   </tbody>
 * </table>
 * @param {string=} option.label the string for the link.
 * See the {@link oj.RouterState#label} property.
 * @param {*=} option.value the object associated with this state.
 * See the {@link oj.RouterState#value} property.
 * @param {boolean=} option.isDefault true if this state is the default.
 * See the Router {@link oj.Router#defaultStateId|defaultStateId} property.
 * @param {(function(): boolean) | (function(): Promise)=} option.canEnter A callback that either
 * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
 * The default value is a method that always returns true.
 * See the {@link oj.RouterState#canEnter} property.
 * @param {(function())|(function(): Promise)=} option.enter A callback or the
 * promise of a callback which execute when entering this state.
 * See the {@link oj.RouterState#enter} property.
 * @param {(function(): boolean)|(function(): Promise)=} option.canExit  A callback that either
 * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
 * The default value is a method that always returns true.
 * See the {@link oj.RouterState#canExit} property.
 * @param {(function())|(function(): Promise)=} option.exit A callback or the
 * promise of a callback which execute when exiting this state.
 * See the {@link oj.RouterState#exit} property.
 * @return {!oj.Router} the oj.Router object this method was called on.
 * @export
 * @see oj.RouterState
 * @example <caption>Add three states with id 'home', 'book' and 'tables':</caption>
 * router.configure({
 *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
 *    'book':   { label: 'Book',   value: 'bookContent' },
 *    'tables': { label: 'Tables', value: 'tablesContent' }
 * });
 * @example <caption>Define a function to retrieve the state:</caption>
 * router.configure(function(stateId) {
 *    var state;
 *
 *    if (stateId) {
 *       state = new oj.RouterState(stateId, { value: data[stateId] }, router);
 *    }
 *    return state;
 * });
 */
oj.Router.prototype.configure = function(option) {
   this._stateId(undefined);
   delete this._defaultStateId;
   // StateId are changing so erase history.
   this._navigationType = undefined;
   this._navHistory = [];

   if (typeof option === 'function') {
      this._states = null;
      // Override prototype
      this.stateFromIdCallback = option;
   }
   else {
      this._states = [];
      // Restore prototype
      delete this.stateFromIdCallback;

      Object.keys(option).forEach(function(key) {
         var rsOptions = option[key];
         this._states.push(new oj.RouterState(key, rsOptions, this));
         // Set the defaultStateId of the router from the isDefault property
         if ((typeof(rsOptions['isDefault']) === 'boolean') && rsOptions['isDefault']) {
            this._defaultStateId = key;
         }
      }, this);
   }

   return this;
};

/**
 * Return the {@link oj.RouterState} object which state id matches one of the possible states of the router.
 * @param {string} stateId - the id of the requested {@link oj.RouterState} object.
 * @return {oj.RouterState|undefined} the state object matching the id.
 * @export
 * @example <caption>Retrieve the RouterState for id 'home':</caption>
 * var homeState = router.getState('home');
 * var homeStateValue = homeState.value;
 */
oj.Router.prototype.getState = function(stateId) {
   return this.stateFromIdCallback(stateId);
};

/**
 * Initialize the default for oj.Router if needed. Dispose on the root router
 * will de-initialize.
 * @private
 */
function _initialize() {
   if (!_initialized) {
      if (!_urlAdapter) {
         _urlAdapter = new oj.Router.urlPathAdapter();
      }
      if (!_ojBaseUrl) {
         _ojBaseUrl = getBaseUrl();
      }

      /**
       * Listen to URL changes caused by back/forward button
       * using the popstate event. Call handlePopState to dispatch the change of URL.
       */
      window.addEventListener('popstate', handlePopState, false);

      oj.Logger.info('Initializing rootInstance.');
      oj.Logger.info('Base URL is %s', _ojBaseUrl);
      oj.Logger.info('This page is %s', _thisPage);
      oj.Logger.info('Current URL is %s', window.location.href);

      _initialized = true;
   }
}

/**
 * Go is used to transition to a new state. In version 1.1 the argument was a
 * state id. In this release the syntax has been extended to accept a path of
 * state ids separated by a slash. The path can be absolute or relative.<br>
 * <br>
 * Example of valid path:
 * <ul>
 *   <li><code class="prettyprint">router.go('home')</code>: transition router
 *    to state id 'home' (1.1 syntax)</li>
 *   <li><code class="prettyprint">router.go('/book/chapt2')</code>: transition
 *    the root instance to state id 'book' and the child router to state id
 *    'chapt2'</li>
 *   <li><code class="prettyprint">router.go('chapt2/edit')</code>: transition
 *   router to state id 'chapt2' and child router to state id 'edit'</li>
 * </ul>
 * <br>
 * If the stateIdPath argument is undefined, go to the default state of the
 * router.<br>
 * A {@link oj.Router.transitionedToState|transitionedToState} signal is
 * dispatched when the state transition has completed.
 * @param {string=} stateIdPath A path of ids representing the state to
 * transition to.
 * @return {!Promise.<{hasChanged: boolean}>} A Promise that resolves when the
 * router is done with the state transition.<br>
 * When the promise is fullfilled, the parameter value is an object with the property
 * <code class="prettyprint">hasChanged</code>.<br>
 * The value of <code class="prettyprint">hasChanged</code> is:
 * <ul>
 *   <li>true: If the router state changed.</li>
 * </ul>
 * When the Promise is rejected, the parameter value is:
 * <ul>
 *   <li>An Error object stipulating the reason for the rejection during the
 *   resolution. Possible errors are:
 *   <ul>
 *     <li>If stateIdPath is defined but is not of type string.</li>
 *     <li>If stateIdPath is undefined but the router has no default state.</li>
 *     <li>If a state id part of the path cannot be found in a router.</li>
 *   </ul>
 *   </li>
 * </ul>
 * @export
 * @example <caption>Transition a router to the state id 'home':</caption>
 * router.go('home');
 * @example <caption>Transition a router to its default state and handle errors:</caption>
 * router.go().then(
 *    function(result) {
 *       if (result.hasChanged) {
 *          oj.Logger.info('Router transitioned to default state.');
 *       }
 *       else {
 *          oj.Logger.info('No transition, Router was already in default state.');
 *       }
 *    },
 *    function(error) {
 *       oj.Logger.error('Transition to default state failed: ' + error.message);
 *    }
 * );
 */
oj.Router.prototype.go = function(stateIdPath) {
   _initialize();

   return _queueTransition({ router: this, path: stateIdPath, origin: 'go' });
};

/**
 * Internal go that takes a flag for push or replace URL.
 * @private
 * @param {?string} stateIdPath A path of ids representing the state to
 * transition to.
 * @param {boolean=} replace push or replace
 * @return {*} A Promise that resolves when the routing is done
 */
oj.Router.prototype._go = function(stateIdPath, replace) {
   var path,
       newUrl,
       newStates,
       useDefault = true;

   if (stateIdPath) {
      if (typeof stateIdPath === 'string') {
         // Empty path string means use default
         if (stateIdPath.length > 0) {
            useDefault = false;
         }
      }
      else {
         return Promise.reject(new Error('Invalid object type for state id.'));
      }
   }

   if (useDefault) {
      stateIdPath = this._defaultStateId || null;
      if (!stateIdPath) {
         // No default defined, so nowhere to go.
         if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
            oj.Logger.info('Undefined state id with no default id on router %s',
                        getRouterFullName(this));
         }
         return Promise.resolve({ 'hasChanged': false });
      }
   }

   // Absolute or relative?
   if ('/' === stateIdPath.charAt(0)) {
      path = stateIdPath;
   }
   else {
      path = getCurrentPath(this._parentRouter) + stateIdPath;
   }

   oj.Logger.info('Destination path: %s', path);

   try {
      newStates = _buildState(this, path);
   }
   catch (err) {
      return Promise.reject(err);
   }

   newUrl = _urlAdapter.buildUrlFromStates(newStates);

   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      oj.Logger.info('Going to URL %s on router %s', newUrl, getRouterFullName(this));
   }

   var shortUrl = '/' + _urlAdapter.cleanUrl(getShortUrl()).replace(_thisPage, '');

   var _changeState = function(canExit) {
      if (canExit) {
         // Remove first '/' if exist before parsing
         // 
         return parseAndUpdate(newUrl.replace(/^\//, '')).
            then(function(params) {
               if (params['hasChanged']) {
                  var fullUrl = _ojBaseUrl + newUrl;
                  oj.Logger.info('%s URL to %s', replace ? 'Replacing' : 'Pushing', fullUrl);
                  window.history[replace ? 'replaceState' : 'pushState'](null, '', fullUrl);
               }
               return params;
            });
      }
      return { 'hasChanged': false };
   };

   // Do not do anything if the new URL is the same.
   // This compare URLs without the bookmarkable data.
   // When replace is true, it is possible the new URL is the same (by example when going to the
   // default state of a child router) but the transition still need to be executed.
   // 
   // 
   if (replace || _urlAdapter.cleanUrl(newUrl) !== shortUrl) {
      oj.Logger.info('Deferred mode or new URL is different.');
      return _canExit(this).then(_changeState);
   }

   return Promise.resolve({ 'hasChanged': false });
};

/**
 * Store additional data for this router that will be added in a compressed form to the URL
 * so it can be bookmarked. When calling this method, the URL is immediately modified.
 * @param {!Object} data the data to store with this state.
 * @throws An error if the bookmarkable state is too big.
 * @export
 * @example <caption>Store a color in the URL:</caption>
 * try {
 *    var color = '#99CCFF';
 *    router.store(color);
 *    $('#chapter').css('background', color);
 * }
 * catch (error) {
 *    oj.Logger.error('Error while storing data: ' + error.message);
 * }
 */
oj.Router.prototype.store = function(data) {
   this._extra = data;

   var extraState = {},
       router = this;

   // Walk the parent routers
   while (router) {
      if (router._extra) {
         extraState[router._name] = router._extra;
      }
      router = router._parentRouter;
   }

   // and the children routers
   router = this;
   var nextLevel, i, sr;
   while (router) {
      for (i = 0; i < router._childRouters.length; i++) {
         sr = router._childRouters[i];
         if (router._stateId() && router._stateId() === sr._parentState) {
            if (sr._extra) {
               extraState[sr._name] = sr._extra;
            }
            nextLevel = sr;
            break;
         }
      }
      router = nextLevel;
      nextLevel = undefined;
   }

   var url = _ojBaseUrl + '/' + _urlAdapter.cleanUrl(getShortUrl());
   url = addStateParam(url, extraState);

   window.history.replaceState(null, '', url);
};

/**
 * Retrieve the additional data stored in the URL.
 * @return {*} the content stored in the URL
 * @export
 * @example <caption>Retrieve the value of the background color stored in the URL:</caption>
 *  oj.Router.sync().then(
 *     function() {
 *        var color = viewModel.router.retrieve();
 *        if (color) {
 *           $('#chapter').css('background', color);
 *        }
 *     },
 *     function(error) {
 *        oj.Logger.error('Error during sync: ' + error.message);
 *     }
 *  );
 */
oj.Router.prototype.retrieve = function() {
   return this._extra;
};

/**
 * Dispose the router.<br>
 * Erase all states of this router and its children.
 * Remove itself from parent router child list.<br>
 * When this method is invoked on the {@link oj.Router.rootInstance|rootInstance}, it
 * also remove internal event listeners and re-initialize the
 * {@link oj.Router.defaults|defaults}.
 * @export
 */
oj.Router.prototype.dispose = function() {
   var parentChildren, i;

   // Depth first
   while (this._childRouters.length > 0) {
      this._childRouters[0].dispose();
   }

   // If this is the root, clean up statics
   if (!this._parentRouter) {
      _ojBaseUrl = '';
      _urlAdapter = {};
      this._name = _DEFAULT_ROOT_NAME;

      window.removeEventListener('popstate', handlePopState);
      oj.Router._transitionedToState.removeAll();
      _initialized = false;
   }
   else {
      // Remove itself from parent children array.
      parentChildren = this._parentRouter._childRouters;
      for (i = 0; i < parentChildren.length; i++) {
        if (parentChildren[i]._name === this._name) {
           parentChildren.splice(i, 1);
           break;
        }
      }

      delete this._parentState;
   }

   delete this._navigationType;
   this._navHistory = [];
   this._states = null;
   delete this._defaultStateId;
   delete this._extra;

};

/**
 * Alias for property oj.Router.transitionedToState
 * @private
 */
oj.Router._transitionedToState = new signals.Signal();

/**
 * Flag set to true when the router is in the process of updating the states
 * involved in the current transition
 * @private
 * @type {boolean}
 */
oj.Router._updating = false;

Object.defineProperties(oj.Router, {
   'rootInstance': { value:
      /**
       * The static instance of {@link oj.Router} representing the unique root router.
       * This instance is created at the time the module is loaded.<br>
       * All other routers will be children of this object.<br>
       * The name of this router is 'root'. To change this name use the
       * {@link oj.Router.defaults|rootInstanceName} property.
       * @name oj.Router.rootInstance
       * @type oj.Router
       * @readonly
       * @example <caption>Retrieve the root router and configure it:</caption>
       * var router = oj.Router.rootInstance;
       * router.configure({
       *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
       *    'book':   { label: 'Book',   value: 'bookContent' },
       *    'tables': { label: 'Tables', value: 'tablesContent' }
       * });
       */
      rootRouter, enumerable: true
   },
   'transitionedToState': { value:
      /**
       * A {@link http://millermedeiros.github.io/js-signals/|signal} dispatched when the state transition
       * has completed either by successfully changing the state or cancelling.<br>
       * The parameter of the event handler is a boolean true when the state has changed.<br>
       * This is usefull when some post processing is needed or to test the result after a state change.
       * @name oj.Router.transitionedToState
       * @readonly
       * @example <caption>Creates promise that resolve when the state transition is complete.</caption>
       * var promise = new Promise(function(resolve, reject) {
       *       oj.Router.transitionedToState.add(function(result) {
       *          if (result.hasChanged) {
       *             oj.Logger.info('The state has changed');
       *          }
       *          resolve();
       *       });
       */
      oj.Router._transitionedToState, enumerable: true
   }
});

/**
 * A set of Router defaults properties.<br>
 * <h6>Warning: </h6>Defaults can not be changed after the first call to {@link oj.Router.sync|sync()}
 * has been made. To re-initialize the router, you need to call {@link oj.Router#dispose|dispose()} on
 * the {@link oj.Router.rootInstance|rootInstance} first then change the defaults.
 * @property {Object} urlAdapter an instance of the url adapter to use. If not specified, the router
 * will be using the path url adapter. Possible values are an instance of
 * {@link oj.Router.urlPathAdapter} or {@link oj.Router.urlParamAdapter}.
 * @property {string} baseUrl the base URL to be used for relative URL addresses. If not specified,
 * it is the current URL without the document.
 * For example <code class="prettyprint">http://www.example.com/myApp</code>. This is needed
 * to properly parse the URL.
 * @property {string} rootInstanceName the name used for the root router. If not defined,
 * the name is 'root'. This is used by the {@link oj.Router.urlParamAdapter|urlParamAdapter} to build
 * the URL in the form of <code class="prettyprint">/index.html?root=book</code>.
 * @export
 * @example <caption>Change the default URL adapter to the urlParamAdapter</caption>
 * oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
 * @example <caption>Change the default base URL</caption>
 * oj.Router.defaults['baseUrl'] = 'http://www.example.com/myApp';
 * @example <caption>Change the default root router name to 'id'</caption>
 * oj.Router.defaults['rootInstanceName'] = 'id';
 */
oj.Router.defaults = {};

Object.defineProperties(oj.Router.defaults, {
   'urlAdapter': {
      get: function() {
         if (!_urlAdapter) {
            _urlAdapter = new oj.Router.urlPathAdapter();
         }
         return _urlAdapter;
      },
      set: function(urlAdapter) {
         if (_initialized) {
            throw new Error('Incorrect operation. Cannot change URL adapter after calling sync() or go().');
         }
         _urlAdapter = urlAdapter;
      },
      enumerable: true,
      readonly: false
   },
   'baseUrl': {
      get: function() {
         if (!_ojBaseUrl) {
            _ojBaseUrl = getBaseUrl();
         }
         return _ojBaseUrl;
      },
      set: function(baseUrl) {
         if (_initialized) {
            throw new Error('Incorrect operation. Cannot change base URL after calling sync() or go().');
         }
         // Assumption is _ojBaseUrl does not have a trailing /
         _ojBaseUrl = baseUrl.replace(/\/$/, '');
      },
      enumerable: true,
      readonly: false
   },
   'rootInstanceName': {
      get: function() {
         return rootRouter._name;
      },
      set: function(rootName) {
         if (_initialized) {
            throw new Error('Incorrect operation. Cannot change the name of the root instance after calling sync() or go().');
         }

         oj.Assert.assertString(rootName);
         rootRouter._name = encodeURIComponent(rootName.trim());
      },
      enumerable: true,
      readonly: false
   }
});

/**
 * Synchronise the router with the current URL. The process parse the URL and
 * <ol>
 *   <li>transition the router to a new state matching the URL.</li>
 *   <li>initialize the bookmarkable storage.</li>
 *   <li>dispatch a {@link oj.Router.transitionedToState|transitionedToState} signal.</li>
 * </ol>
 * It has to be called after a router is configured, to synchronise the URL with the
 * router state.<br>
 * If a default state is defined, the router will transition to it, otherwise no transition will
 * occur and the router will be in an undefined state.<br>
 * Because the process of transitioning between two states invokes callbacks (canExit, canEnter)
 * that are promises, this function also returns a promise.
 * @return {!Promise.<{hasChanged: boolean}>} A Promise that resolves when the router is done with
 * the state transition.<br>
 * When the Promise is fullfilled, the parameter value is an object with the property
 * <code class="prettyprint">hasChanged</code>.<br>
 * The value of <code class="prettyprint">hasChanged</code> is:
 * <ul>
 *   <li>true: If the router state changed.</li>
 * </ul>
 * When the Promise is rejected, the parameter value is:
 * <ul>
 *   <li>An Error object stipulating the reason for the rejection when an error
 * occurred during the resolution.</li>
 * </ul>
 * @export
 * @example <caption>Start the root instance</caption>
 * var router = oj.Router.rootInstance;
 * // Add three states to the router with id 'home', 'book' and 'tables
 * router.configure({
 *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
 *    'book':   { label: 'Book',   value: 'bookContent' },
 *    'tables': { label: 'Tables', value: 'tablesContent' }
 * });
 *
 * var viewModel = {
 *    router: router
 * };
 *
 * oj.Router.sync().then(
 *    function() {
 *       ko.applyBindings(viewModel);
 *    },
 *    function(error) {
 *       oj.Logger.error('Error when starting the router: ' + error.message);
 *    }
 * );
 * @example <caption>Synchronise a newly created child Router and retrieve the bookmarkable state</caption>
 *  oj.Router.sync().then(
 *     function() {
 *        var color = viewModel.router.retrieve();
 *        if (color) {
 *           $('#chapter').css('background', color);
 *        }
 *     },
 *     function(error) {
 *        oj.Logger.error('Error during sync: ' + error.message);
 *     }
 *  );
 *
 */
oj.Router.sync = function() {
   var transition;

   _initialize();

   oj.Logger.info('Entering sync.');

   if (_deferredPath) {
      transition = { router: rootRouter, path: _deferredPath, deferredHandling: true, replace: true };
      _deferredPath = undefined;
      return _queueTransition(transition);
   }

   if (oj.Router._updating) {
      oj.Logger.info('Sync called while updating, waiting for updates to end.');
      // Returms a promise that resolve as soon as the current transition is complete.
      return new Promise(function(resolve) {
         oj.Router._transitionedToState.addOnce(function(result) {
            oj.Logger.info('Sync updates done.');
            resolve(result);
         });
      });
   }

   transition = { router: rootRouter, url: getShortUrl(), origin: 'sync' };
   return _queueTransition(transition);
};

/*------------------------------------------------------------------------------
  URL Apdaters section
  ------------------------------------------------------------------------------*/

/**
 *
 * @class
 * @since 1.1.0
 * @classdesc Url adapter used by the {@link oj.Router} to manage URL in the form of
 * <code class="prettyprint">/book/chapter2</code>.<br>The UrlPathAdapter is the default
 * adapter used by the {@link oj.Router|router}. There are two available URL adapters,
 * this one and the {@link oj.Router.urlParamAdapter|urlParamAdapter}.<br>To change
 * the URL adapter, use the {@link oj.Router.defaults|urlAdapter} property.
 * @see oj.Router.urlParamAdapter
 * @see oj.Router.defaults
 * @constructor
 * @export
 */
oj.Router.urlPathAdapter = function () {
   /**
    * Construct an array of states where each item is an object made of a router and
    * the new state for it.
    * @ignore
    * @param {string} url
    * @return {!Array.<{value:string, router:!oj.Router}>}
    */
   this.parse = function(url) {
      var router = rootRouter,
          segments = url.split('/'),
      //    states = buildSelected(router),
          changes = [],
      //    undef = [],
          value;

      do {
         value = segments.shift();
         if (value) {
            if (value.length === 0 || /\.html$/i.test(value)) {
               value = undefined;
            }
         }

         value = value || router._defaultStateId;
      //   if (value) {
      //      changes.push({ value: value, router: router, stateId: value });
      //   }
         changes.push({ value: value, router: router });

         router = _getChildRouter(router, value);
      } while (router);

      // Order is exit(undef) from leaf to root followed by enter from root to leaf
      // states.forEach(function(select, i) {
      //    var change = changes[i];

      //    if  (!change || select.router !== change.router) {
      //       undef.unshift(select);
      //    }
      // });

      // return undef.concat(changes);

      return changes;
   };

   /**
    * Given an ordered array of states, build the URL representing all
    * the states.
    * Always starts with a '/': /index.html, /book/chapter2
    * @ignore
    * @param {Array.<{router:oj.Router, stateId:string}>} newStates
    * @return {!string} the URL representing the states
    */
   this.buildUrlFromStates = function(newStates) {
      var newUrl = '',
          extraState = {}; // Compound object of all extra states

      // Build the new URL
      newStates.forEach(function(ns) {
         if (ns.stateId) {
            newUrl += '/' + ns.stateId;
         }
         if (ns.router.extra) {
            extraState[ns.router._name] = ns.router._extra;
         }
      });

      // No page or this page are aliases.
      if (newUrl === '') {
         // 
         newUrl = '/' + _thisPage;
      }

      try {
         newUrl = addStateParam(newUrl, extraState);
      }
      catch (err) {
         oj.Logger.error('Error while building URL: %s', err);
      }

      return newUrl;
   };

   /**
    * Return the significant part of an URL.
    * @ignore
    * @param {!string} url
    * @return {!string} the short URL
    */
   this.cleanUrl = function(url) {
      return url.split('?')[0];
   };

   /**
    * Return extra query param
    * @ignore
    * @param {string} url
    * @return {!Object.<string, string>}
    */
   this.getQueryParam = function(url) {
      var queryIndex = url.indexOf('?'),
          queryString = null;

      if (queryIndex !== -1) {
         queryString = url.substr(queryIndex + 1);
      }

      return parseQueryParam(queryString);
   };
};

/**
 * @class
 * @since 1.1.0
 * @classdesc Url adapter used by the {@link oj.Router} to manage URL in the form of
 * <code class="prettyprint">/index.html?root=book&book=chapter2</code>.<br>There are two available
 * URL adapters, this one and the {@link oj.Router.urlPathAdapter|urlPathAdapter}.<br>To change
 * the URL adapter, use the {@link oj.Router.defaults|urlAdapter} property.
 * @see oj.Router.urlPathAdapter
 * @see oj.Router.defaults
 * @constructor
 * @export
 * @example <caption>Change the default URL adapter to urlParamAdapter instead of urlPathAdapter:</caption>
 * oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
 */
oj.Router.urlParamAdapter = function () {
   /**
    * Construct an array of states where each item is an object made of a router and
    * the new state for it.
    * @ignore
    * @param {string} url
    * @return {!Array.<{value:string, router:!oj.Router}>}
    */
   this.parse = function(url) {
      var params = this.getQueryParam(url),
          router = rootRouter,
      //    states = buildSelected(router),
          changes = [],
      //    undef = [],
          value;

      do {
         value = params[router._name];
         if (value) {
            value = value[0];
            delete params[router._name];
         }

         value = value || router._defaultStateId;
      //   if (value) {
      //      changes.push({ value: value, router: router, stateId: value });
      //   }
		 changes.push({ value: value, router: router });
         router = _getChildRouter(router, value);
      } while (router);

      // // Order is exit(undef) from leaf to root followed by enter from root to leaf
      // states.forEach(function(select, i) {
      //    var change = changes[i];

      //    if  (!change || select.router !== change.router) {
      //       undef.unshift(select);
      //    }
      // });

      // return undef.concat(changes);

      return changes;
   };

   /**
    * Given an ordered array of states, build the URL representing all
    * the states.
    * Always starts with a '/': /index.html, /book/chapter2
    * @ignore
    * @param {Array.<{router:oj.Router, stateId:string}>} newStates
    * @return {!string} the URL representing the states
    * @throws An error if bookmarkable state is too big.
    */
   this.buildUrlFromStates = function(newStates) {
      var newUrl = '/' + _thisPage,
          extraState = {}, // Compound object of all extra states
          sep = '?';

      // Build the new URL
      newStates.forEach(function(ns) {
         if (ns.stateId) {
            newUrl += sep + ns.router._name + '=' + ns.stateId;
            sep = '&'; // From now on, use this separator
         }
         if (ns.router._extra) {
            extraState[ns.router._name] = ns.router._extra;
         }
      });

      try {
         newUrl = addStateParam(newUrl, extraState);
      }
      catch (err) {
         oj.Logger.error('Error while building URL: %s', err);
      }

      return newUrl;
   };

   /**
    * Return the significant part of an URL.
    * @ignore
    * @param {!string} url
    * @return {!string} the short URL
    */
   this.cleanUrl = function(url) {
      var index = url.indexOf(_ROUTER_PARAM);
      if (index !== -1) {
         return url.substr(0, index - 1);
      }
      return url;
   };

   /**
    * Return extra query param
    * @ignore
    * @param {string} url
    * @return {!Object.<string, string>}
    */
   this.getQueryParam = function(url) {
      var queryIndex = url.indexOf('?'),
          queryString = null,
          params = {};

      if (queryIndex !== -1) {
         queryString = url.substr(queryIndex + 1);
         params = parseQueryParam(queryString);
      }

      // 
      return params;
   };


};

return rootRouter;

}());
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*jslint browser: true*/
/*global oj, Promise */

/**
 * The RouterState module.
 */

// Wrap in a IIFE to prevents the possiblity of collision in a non-AMD scenario.
(function() {
"use strict";
   /**
    * @class
    * @since 1.1.0
    * @classdesc
    * Object representing a state of the router.
    * @desc
    * It is the type of the {@link oj.Router#currentState|currentState} property and type of
    * the value returned by {@link oj.Router#getState|getState(String)}.
    * @param {!string} id the state id.
    * See the {@link oj.RouterState#id} property.
    * @param {!Object=} options an object defining the state.
    * @param {string=} options.label the string to be displayed in the command component.
    * See the {@link oj.RouterState#label} property.
    * @param {*=} options.value the object associated with this state.
    * See the {@link oj.RouterState#value} property.
    * @param {boolean=} options.isDefault true if this state is the default.
    * See the {@link oj.Router#defaultStateId|defaultStateId} property.
    * @param {(function(): boolean) | (function(): Promise)=} options.canEnter A callback that either
    * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
    * The default value is a method that always returns true.
    * See the {@link oj.RouterState#canEnter} property.
    * @param {(function()) | (function(): Promise)=} options.enter A callback or
    * the promise of a callback which execute when entering this state.
    * See the {@link oj.RouterState#enter} property.
    * @param {(function(): boolean)|(function(): Promise)=} options.canExit  A callback that either
    * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
    * The default value is a method that always returns true.
    * See the {@link oj.RouterState#canExit} property.
    * @param {(function()) | (function(): Promise)=} options.exit A callback or
    * the promise of a callback which execute when exiting this state.
    * See the {@link oj.RouterState#canExit} property.
    * @param {oj.Router=} router The router this state belongs to. If undefined, the method
    * {@link oj.RouterState#go|go} and {@link oj.RouterState#isCurrent|isCurrent} will not work.
    * @constructor
    * @export
    */
   oj.RouterState = function (id, options, router) {
      options = options || {};
      oj.Assert.assertString(id);

      // Encode the id since it will be part of the URL
      // We cannot have duplicate because the format of the object parameter
      // doesn't allow it.
      this._id = encodeURIComponent(id.trim());

      /**
       * A callback that either returns a boolean or the Promise of a boolean.
       * When defined, this callback is executed before entering this state. If the boolean
       * is true the transition will continue, otherwise the state is not entered and the
       * current state of the router does not change.
       * The default value is a method that always returns true.
       * @name oj.RouterState#canEnter
       * @type {(function(): boolean)|(function(): Promise)|undefined}
       */
      this._canEnter = options['canEnter'];
      if (this._canEnter) {
         oj.Assert.assertFunctionOrNull(this._canEnter);
      }

      /**
       * A callback or the promise of a callback which execute when entering this
       * state.
       * This callback executes after the router stateId changes.
       * @name oj.RouterState#enter
       * @type {(function())|(function(): Promise)|undefined}
       */
      this._enter = options['enter'];
      if (this._enter) {
         oj.Assert.assertFunctionOrNull(this._enter);
      }

      /**
       * A callback that either returns a boolean or the Promise of a boolean.
       * When defined, this callback is executed before exiting this state. If the boolean
       * is true the transition will continue, otherwise the state is not exited and the
       * current state of the router does not change.
       * The default value is a method that always returns true.
       * @name oj.RouterState#canExit
       * @type {(function(): boolean)|(function(): Promise)|undefined}
       */
      this._canExit = options['canExit'];
      if (this._canExit) {
         oj.Assert.assertFunctionOrNull(this._canExit);
      }

      /**
       * A callback or the promise of a callback which execute when exiting this
       * state.
       * This callback executes before the router stateId changes.
       * @name oj.RouterState#exit
       * @type {(function())|(function(): Promise)|undefined}
       */
      this._exit = options['exit'];
      if (this._exit ) {
         oj.Assert.assertFunctionOrNull(this._exit );
      }
      /**
       * The value associated with this state. When this state is the current state of the
       * router, it is the value returned by the observable {@link oj.Router#currentValue}.
       * @name oj.RouterState#value
       * @type {*}
       */
      this._value = options['value'];

      /**
       * The string to be used for the navigation component that will transition to this state.
       * @name oj.RouterState#label
       * @type {string|undefined}
       * @example <caption>Use the label property for the text of anchor tags in a list:</caption>
       * &lt;ul id="foreachMenu" data-bind="foreach: router.states">
       *   &lt;li>
       *     &lt;a data-bind="text: label, css: {'active': isCurrent()},
       *                   attr: {id: id}, click: go"> &lt;/a>
       *   &lt;/li>
       * &lt;/ul>
       */
      this._label = options['label'];

      /**
       * @private
       * @type {oj.Router|undefined}
       *
       */
      this._router = router;

      /**
       * This property is used when the router states are ojModule names.
       * When the router transition to this state, it will attempt to execute the callbacks canExit, canEnter,
       * enter and exit on the viewModel object first. If the callback is not defined on the viewModel, the
       * router will attempt to execute the callback on the {@link oj.RouterState|RouterState}.
       * @private
       * @type {Object|undefined}
       */
      this.viewModel = undefined;

      Object.defineProperties(this, {
         'id': { value:
            /**
             * The id of this state.<br>
             * It uniquely identify a state object in a router. The id property can be used as the
             * attribute id of a navigation component like link or button.
             * @name oj.RouterState#id
             * @readonly
             * @type {!string}
             * @example <caption>Use the state id property for the attribute id of anchor tags in a list:</caption>
             * &lt;ul id="foreachMenu" data-bind="foreach: router.states">
             *   &lt;li>
             *     &lt;a data-bind="text: label, css: {'active': isCurrent()},
             *                   attr: {id: id}, click: go"> &lt;/a>
             *   &lt;/li>
             * &lt;/ul>
             */
            (this._id), enumerable: true
         },
         'value': {
            get: function () { return this._value; },
            set: function(newValue) { this._value = newValue; },
            enumerable: true
         },
         'label': {
            get: function () { return this._label; },
            set: function(newValue) { this._label = newValue; },
            enumerable: true
         },
         'canEnter': {
            get: function () { return this._canEnter; },
            set: function(newValue) { this._canEnter = newValue; },
            enumerable: true
         },
         'enter': {
            get: function () { return this._enter; },
            set: function(newValue) { this._enter = newValue; },
            enumerable: true
         },
         'canExit': {
            get: function () { return this._canExit; },
            set: function(newValue) { this._canExit = newValue; },
            enumerable: true
         },
         'exit': {
            get: function () { return this._exit; },
            set: function(newValue) { this._exit = newValue; },
            enumerable: true
         }
      });
   };

   /**
    * Transition the router to this state.
    * This is a convenience method used as the event handler for a Knockout click binding on
    * a button or <code class="prettyprint">a</code> tag.<br>
    * A {@link oj.Router.transitionedToState|transitionedToState} signal is dispatched when the
    * state transition has completed.
    * @return {!Promise.<{hasChanged: boolean}>} A Promise that resolves when the
    * router is done with the state transition.<br>
    * When the promise is fullfilled, the parameter value is an object with the property
    * <code class="prettyprint">hasChanged</code>.<br>
    * The value of <code class="prettyprint">hasChanged</code> is:
    * <ul>
    *   <li>true: If the router state changed.</li>
    * </ul>
    * When the Promise is rejected, the parameter value is:
    * <ul>
    *   <li>An Error object stipulating the reason for the rejection when an error
    * occurred during the resolution.</li>
    * </ul>
    * @export
    * @example <caption>Use the go function as the handler for a click binding:</caption>
    * &lt;ul id="foreachMenu" data-bind="foreach: router.states">
    *   &lt;li>
    *     &lt;a data-bind="text: label, css: {'active': isCurrent()},
    *                   attr: {id: id}, click: go"> &lt;/a>
    *   &lt;/li>
    * &lt;/ul>
    */
   oj.RouterState.prototype.go = function() {
      if (!this._router) {
         oj.Router._transitionedToState.dispatch({ 'hasChanged': false });
         return Promise.reject(new Error('Router is not defined for this RouterState object.'));
      }
      return this._router.go(this._id);
   };

   /**
    * Determine if the router current state is this state.
    * This method is typically used by elements in the markup to show the appropriate selection value.
    * @return {boolean} true if this state is the current router state.
    * @throws An error if an owning router was not specified when the state was
    * created.
    * @export
    * @example <caption>Use the is function to change the css of the state links:</caption>
    * &lt;ul id="foreachMenu" data-bind="foreach: router.states">
    *   &lt;li>
    *     &lt;a data-bind="text: label, css: {'active': isCurrent()},
    *                   attr: {id: id}, click: go"> &lt;/a>
    *   &lt;/li>
    * &lt;/ul>
    */
   oj.RouterState.prototype.isCurrent = function() {
      if (!this._router) {
         throw new Error('Router is not defined for this RouterState object.');
      }
      return this._router._stateId() === this._id;
   };

}());
/**
 * Utility to compress JSON to store on the URL.
 */
(function() {

oj.LZString = {

   /**
    * Compress into a string that is URI encoded
    * @ignore
    * @param {?string} input
    * @return {string}
    */
   compressToEncodedURIComponent: function(input) {
      if (input === null) {
         return '';
      }
      return _compress(input, 6, function(a) {
         return _keyStrUriSafe.charAt(a);
      });
   },

   /**
    * Decompress from an output of compressToEncodedURIComponent
    * @ignore
    * @param {?string} input
    * @return {?string}
    */
   decompressFromEncodedURIComponent: function(input) {
      if (input === null) {
         return '';
      }
      if (input === '') {
         return null;
      }
      return _decompress(input.length, 32, function(index) {
         return _getBaseValue(_keyStrUriSafe, input.charAt(index));
      });
   }
};

var _fcc = String.fromCharCode;
var _keyStrUriSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';
var _baseReverseDic;

/**
 * @param  {string} alphabet
 * @param  {string} character
 * @return {string}
 */
function _getBaseValue(alphabet, character) {
   var i;

   if (!_baseReverseDic) {
      _baseReverseDic = {};
   }
   if (!_baseReverseDic[alphabet]) {
      _baseReverseDic[alphabet] = {};
      for (i = 0; i < alphabet.length; i++) {
         _baseReverseDic[alphabet][alphabet[i]] = i;
      }
   }
   return _baseReverseDic[alphabet][character];
}

/**
 * @param  {?string} uncompressed
 * @param  {number} bitsPerChar
 * @param  {function(number):string} getCharFromInt
 * @return {string}
 */
function _compress(uncompressed, bitsPerChar, getCharFromInt) {
   if (uncompressed === null) {
      return '';
   }
   var i, value,
      context_dictionary = {},
      context_dictionaryToCreate = {},
      context_w = '',
      context_enlargeIn = 2, // Compensate for the first entry which should not count
      context_dictSize = 3,
      context_numBits = 2,
      context_data_string = '',
      context_data_val = 0,
      context_data_position = 0,
      context_c,
      context_wc,
      ii,
      len = uncompressed.length;

   for (ii = 0; ii < len; ii++) {
      context_c = uncompressed[ii];
      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
         context_dictionary[context_c] = context_dictSize++;
         context_dictionaryToCreate[context_c] = true;
      }

      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
         context_w = context_wc;
      } else {
         if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
            if (context_w.charCodeAt(0) < 256) {
               for (i = context_numBits; i--;) {
                  context_data_val = (context_data_val << 1);
                  if (context_data_position == bitsPerChar - 1) {
                     context_data_position = 0;
                     context_data_string += getCharFromInt(context_data_val);
                     context_data_val = 0;
                  } else {
                     context_data_position++;
                  }
               }
               value = context_w.charCodeAt(0);
               for (i = 8; i--; ) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position == bitsPerChar - 1) {
                     context_data_position = 0;
                     context_data_string += getCharFromInt(context_data_val);
                     context_data_val = 0;
                  } else {
                     context_data_position++;
                  }
                  value = value >> 1;
               }
            } else {
               value = 1;
               for (i = context_numBits; i--;) {
                  context_data_val = (context_data_val << 1) | value;
                  if (context_data_position == bitsPerChar - 1) {
                     context_data_position = 0;
                     context_data_string += getCharFromInt(context_data_val);
                     context_data_val = 0;
                  } else {
                     context_data_position++;
                  }
                  value = 0;
               }
               value = context_w.charCodeAt(0);
               for (i = 16; i--;) {
                  context_data_val = (context_data_val << 1) | (value & 1);
                  if (context_data_position == bitsPerChar - 1) {
                     context_data_position = 0;
                     context_data_string += getCharFromInt(context_data_val);
                     context_data_val = 0;
                  } else {
                     context_data_position++;
                  }
                  value = value >> 1;
               }
            }
            context_enlargeIn--;
            if (context_enlargeIn == 0) {
               context_enlargeIn = Math.pow(2, context_numBits);
               context_numBits++;
            }
            delete context_dictionaryToCreate[context_w];
         } else {
            value = context_dictionary[context_w];
            for (i = context_numBits; i--;) {
               context_data_val = (context_data_val << 1) | (value & 1);
               if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data_string += getCharFromInt(context_data_val);
                  context_data_val = 0;
               } else {
                  context_data_position++;
               }
               value = value >> 1;
            }


         }
         context_enlargeIn--;
         if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
         }
         // Add wc to the dictionary.
         context_dictionary[context_wc] = context_dictSize++;
         context_w = String(context_c);
      }
   }

   // Output the code for w.
   if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
         if (context_w.charCodeAt(0) < 256) {
            for (i = context_numBits; i--;) {
               context_data_val = (context_data_val << 1);
               if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data_string += getCharFromInt(context_data_val);
                  context_data_val = 0;
               } else {
                  context_data_position++;
               }
            }
            value = context_w.charCodeAt(0);
            for (i = 8; i--;) {
               context_data_val = (context_data_val << 1) | (value & 1);
               if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data_string += getCharFromInt(context_data_val);
                  context_data_val = 0;
               } else {
                  context_data_position++;
               }
               value = value >> 1;
            }
         } else {
            value = 1;
            for (i = context_numBits; i--;) {
               context_data_val = (context_data_val << 1) | value;
               if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data_string += getCharFromInt(context_data_val);
                  context_data_val = 0;
               } else {
                  context_data_position++;
               }
               value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 16; i--;) {
               context_data_val = (context_data_val << 1) | (value & 1);
               if (context_data_position == bitsPerChar - 1) {
                  context_data_position = 0;
                  context_data_string += getCharFromInt(context_data_val);
                  context_data_val = 0;
               } else {
                  context_data_position++;
               }
               value = value >> 1;
            }
         }
         context_enlargeIn--;
         if (context_enlargeIn == 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
         }
         delete context_dictionaryToCreate[context_w];
      } else {
         value = context_dictionary[context_w];
         for (i = context_numBits; i--;) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position == bitsPerChar - 1) {
               context_data_position = 0;
               context_data_string += getCharFromInt(context_data_val);
               context_data_val = 0;
            } else {
               context_data_position++;
            }
            value = value >> 1;
         }


      }
      context_enlargeIn--;
      if (context_enlargeIn == 0) {
         context_enlargeIn = Math.pow(2, context_numBits);
         context_numBits++;
      }
   }

   // Mark the end of the stream
   value = 2;
   for (i = context_numBits; i--;) {
      context_data_val = (context_data_val << 1) | (value & 1);
      if (context_data_position == bitsPerChar - 1) {
         context_data_position = 0;
         context_data_string += getCharFromInt(context_data_val);
         context_data_val = 0;
      } else {
         context_data_position++;
      }
      value = value >> 1;
   }

   // Flush the last char
   while (true) {
      context_data_val = (context_data_val << 1);
      if (context_data_position == bitsPerChar - 1) {
         context_data_string += getCharFromInt(context_data_val);
         break;
      } else context_data_position++;
   }
   return context_data_string;
}

/**
 * @param  {number} length
 * @param  {number} resetValue
 * @param  {function(number):string} getNextValue
 * @return {?string}
 */
function _decompress(length, resetValue, getNextValue) {
   var dictionary = [],
      next,
      enlargeIn = 4,
      dictSize = 4,
      numBits = 3,
      entry = '',
      result = '',
      i,
      w,
      bits, resb, maxpower, power,
      c,
      data = {
         val: getNextValue(0),
         position: resetValue,
         index: 1
      };

   for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
   }

   bits = 0;
   maxpower = Math.pow(2, 2);
   power = 1;
   while (power != maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position == 0) {
         data.position = resetValue;
         data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
   }

   switch (next = bits) {
      case 0:
         bits = 0;
         maxpower = Math.pow(2, 8);
         power = 1;
         while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
               data.position = resetValue;
               data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
         }
         c = _fcc(bits);
         break;
      case 1:
         bits = 0;
         maxpower = Math.pow(2, 16);
         power = 1;
         while (power != maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position == 0) {
               data.position = resetValue;
               data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
         }
         c = _fcc(bits);
         break;
      case 2:
         return "";
   }
   dictionary[3] = c;
   w = result = c;
   while (true) {
      if (data.index > length) {
         return "";
      }

      bits = 0;
      maxpower = Math.pow(2, numBits);
      power = 1;
      while (power != maxpower) {
         resb = data.val & data.position;
         data.position >>= 1;
         if (data.position == 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
         }
         bits |= (resb > 0 ? 1 : 0) * power;
         power <<= 1;
      }

      switch (c = bits) {
         case 0:
            bits = 0;
            maxpower = Math.pow(2, 8);
            power = 1;
            while (power != maxpower) {
               resb = data.val & data.position;
               data.position >>= 1;
               if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
               }
               bits |= (resb > 0 ? 1 : 0) * power;
               power <<= 1;
            }

            dictionary[dictSize++] = _fcc(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
         case 1:
            bits = 0;
            maxpower = Math.pow(2, 16);
            power = 1;
            while (power != maxpower) {
               resb = data.val & data.position;
               data.position >>= 1;
               if (data.position == 0) {
                  data.position = resetValue;
                  data.val = getNextValue(data.index++);
               }
               bits |= (resb > 0 ? 1 : 0) * power;
               power <<= 1;
            }
            dictionary[dictSize++] = _fcc(bits);
            c = dictSize - 1;
            enlargeIn--;
            break;
         case 2:
            return result;
      }

      if (enlargeIn == 0) {
         enlargeIn = Math.pow(2, numBits);
         numBits++;
      }

      if (dictionary[c]) {
         entry = dictionary[c];
      } else {
         if (c === dictSize) {
            entry = w + w[0];
         } else {
            return null;
         }
      }
      result += entry;

      // Add w+entry[0] to the dictionary.
      dictionary[dictSize++] = w + entry[0];
      enlargeIn--;

      w = entry;

      if (enlargeIn == 0) {
         enlargeIn = Math.pow(2, numBits);
         numBits++;
      }

   }
}

})();
});
