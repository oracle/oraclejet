/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
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
 * Hold the value of the oj.Router.defaults.baseUrl property.
 * @private
 * @type {!string}
 */
var _baseUrlProp = '/';

/**
 * Hold the title before being modified by router
 * @private
 * @type {?string}
 */
var _originalTitle;

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
 * The separator used to build the title from router labels.
 * @private
 * @const
 * @type {string}
 */
var _TITLE_SEP = ' | ';

/**
 * Maximum size of URL
 * @private
 * @const
 * @type {number}
 */
var _MAX_URL_LENGTH = 1024;

/**
 * Name of the window event used to listen to the browser history changes
 * @private
 * @const
 * @type {string}
 */
var _POPSTATE = 'popstate';

/**
 * Name of the property of the object in the Promise returned by go() or sync()
 * @private
 * @const
 * @type {string}
 */
var _HAS_CHANGED = 'hasChanged';

/**
 * Object commonly used as return value for go() or sync()
 * @private
 * @const
 * @type {{hasChanged:boolean}}
 */
var _NO_CHANGE_OBJECT = { 'hasChanged': false };

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
 * A shortcut to access window.location
 * @private
 */
var _location = window.location;

/**
 * The instance of the root router.
 * @private
 * @const
 * @type {!oj.Router}
 */
var rootRouter;

/**
 * Return key/value object of query parameters.
 * @private
 * @return {!Object.<string, string>}
 */
function parseQueryParam(queryString) {
   var params = {},
       keyValPairs;

   // Remove starting '?'
   queryString = queryString.split('?')[1];

   if (queryString) {
      keyValPairs = queryString.split('&');
      keyValPairs.forEach(function(pair) {
         var parts = pair.split(/\=(.+)?/);
         var key = parts[0];
         var value;

         if (key.length) {
            if (!params[key]) {
               params[key] = [];
            }
            value = parts[1] && decodeURIComponent(parts[1]);
            params[key].push(value);
         }
      });
   }

   return params;
}

/**
 * Build an URL by replacing portion of the existing URL. Portion that can be replaces are
 * pathname and search field. Use the extraState to build the new state param.
 * @private
 * @param  {!Object} pieces
 * @param  {!Object.<string, Object>} extraState
 * @return {!string}
 */
function _buildUrl(pieces, extraState) {
   var parser = document.createElement('a');
   parser.href = _location.href;

   if (pieces.search !== undefined) {
      parser.search = pieces.search;
   }

   if (pieces.pathname !== undefined) {
      parser.pathname = pieces.pathname;
   }

   // Add or replace the existing state param
   parser.search = putStateParam(parser.search, extraState);

   return parser.href.replace(/\?$/, ''); // Remove trailing ? for IE
}

/**
 * Return the {@link oj.RouterState} object for a specific router given a state id.
 * @private
 * @param {oj.Router} router The router object.
 * @param {string} stateId The state id.
 * @return {oj.RouterState | undefined} The state object.
 */
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
 * Retrieves the absolute path to the current state. If one of the parent router current state is
 * not defined, the path is meaningless so returns undefined.
 * @private
 * @param {oj.Router|undefined} router
 * @return {string|undefined} path
 */
function getCurrentPath(router) {
   var path, sId;

   if (router) {
      path = getCurrentPath(router._parentRouter);

      if (path) {
         sId = router._stateId();

         if (sId) {
            path += sId + '/';
         }
         else {
            path = undefined;
         }
      }
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
 * Only keep changes where the value doesn't match the router state
 * @param {!Array.<{router:!oj.Router, value:string}>} states
 * @return {!Array.<{router:!oj.Router, value:string}>}
 */
function _filterNewState(states) {
   var newStates = states.filter(function(state) {
      return (state.value !== state.router._stateId());
   });

   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      oj.Logger.info('Potential changes are: ');
      newStates.forEach(function(change) {
         oj.Logger.info('   { router: %s, value: %s }',
                        getRouterFullName(change.router),
                        change.value);
      });
   }

   return newStates;
}

/**
 * Update the bookmarkable data
 * @private
 * @this {!Object.<string, Object>}
 * @param {!{router:!oj.Router, value:string}} change
 */
function _updateBookmarkableData(change) {
   var ex = this[change.router._name];
   if (ex !== undefined) {
      change.router._extra = ex;
   }
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
 * @param {!Object.<string, Object>} extraState
 * @return {!string}
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
 * @private
 * @param {!string} param
 * @return {!Object.<string, Object>}
 * @throws An error if parsing fails or format is invalid.
 */
function decodeStateParam(param) {
   var extraState;
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

   extraState = /** @type {!Object.<string, Object>} */ (JSON.parse(param));

   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      var name;
      oj.Logger.info('Bookmarkable data: ');
      for (name in extraState) {
         oj.Logger.info('   { router: %s, value: %s }', name, extraState[name]);
      }
   }

   return extraState;
}

/**
 * Replace the state param in the URL.
 * @private
 * @param {!string} url the url to which the param will be added
 * @param {!Object.<string, Object>} extraState the object to be stored in the param
 * @return {!string} the URL with the new state param
 */
function putStateParam(url, extraState) {
   var stateParam = '';
   var startSegment, endSegment;
   var start = url.indexOf(_ROUTER_PARAM);

   if (start !== -1) {
      var end = url.indexOf('&', start);
      if (end === -1) {
         end = url.length;
      }

      startSegment = url.substring(0, start);
      endSegment = url.substr(end);
   }
   else {
      startSegment = url + ((url.indexOf('?') === -1) ? '?' : '&');
      endSegment = '';
   }

   if (extraState && Object.getOwnPropertyNames(extraState).length > 0) {
      stateParam = encodeStateParam(extraState);
   }
   else {
      // Remove the '?' or '&'
      startSegment = startSegment.substring(0, startSegment.length -1);
   }

   return startSegment + stateParam + endSegment;
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
 * Traverse the tree of routers and build an array of state made of the router and the current
 * state value.
 * The first item of the array is the root and the last is the leaf.
 * @private
 * @param  {oj.Router} router
 */
function _buildAllCurrentState(router) {
   var states = [];

   if (router._currentState()) {
      states.push({ router: router, stateId: router._stateId() });

      router._childRouters.forEach(function (child) {
         states = states.concat(_buildAllCurrentState(child));
      });
   }

   return states;
}

/**
 * Build a page title using the label of the current child routers state
 * @private
 * @param  {oj.Router|undefined} router
 * @return {!{segment: string, title: string}}
 */
function _buildTitle(router) {
   if (!router) {
      return { title: '', segment: '' };
   }

   // Recurse leaf first
   var titleInfo = _buildTitle(_getChildRouter(router, router._stateId()));

   // If we don't have a title yet, build one.
   if (titleInfo.title === '') {
      var state = router._currentState();
      if (state) {
         // If a title property is present, it has precedence.
         var title = state._title;
         if (title !== undefined) {
            if (typeof title === 'function') {
               title = title();
            }
            titleInfo.title = String(title);
         }
         else {
            // Otherwise, compose the title with the label
            title = state._label;
            if (title !== undefined) {
               title =  String(title);
               // Append existing segment
               if (titleInfo.segment !== '') {
                  title += _TITLE_SEP + titleInfo.segment;
               }
               titleInfo.segment = title;
            }
         }
      }
   }

   return titleInfo;
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
 * Takes an array of changes from parsing and appends other changes needed to be done.
 * 1) All cascading default state
 * 2) All the state that need to become undefined
 * @private
 * @param {!Array.<{router:!oj.Router, value:string}>} states
 * @return {!Array.<{router:!oj.Router, value:string}>}
 */
function _appendOtherChanges(states) {
   var lastItem = states[states.length -1];
   var router, value;

   // If there is a state, starts with it
   if (lastItem) {
      router = lastItem.router;
      value = lastItem.value;
   }
   // Otherwise, starts at the root router
   else {
      router = rootRouter;
      value = rootRouter._defaultStateId;
      if (value) {
         states.push({ value: value, router: router });
      }
   }

   // Append all the default states all the way to the leaf router
   while (!!(router = _getChildRouter(router, value))) {
      value = router._defaultStateId;
      if (value) {
         states.push({ value: value, router: router });
      }
   }

   var currentStates = _buildAllCurrentState(rootRouter);
   var undef = [];

   // Build an array of all the state to become undefined due to the parent state changing. The
   // order of execution is leaf first.
   currentStates.forEach(function (select, i) {
      var change = states[i];

      // Only insert change for a different router since the undef change will already happen when
      // a router transition to a different state.
      if  (!change || select.router !== change.router) {
         undef.unshift(select);
      }
   });

   // The order of execution is exit(undef) from leaf to root followed by enter from root to leaf
   states = undef.concat(states);

   return states;
}

/**
 * Build an array of objects by visiting the parent hierarchy.
 * Each element of the array represent the state of a router.
 * @private
 * @param {!oj.Router} router
 * @param {!string} path
 * @return {!Array.<{router:!oj.Router, value:string}>}
 */
function _buildStateFromPath(router, path) {
   var newStates = [],
       routers = [],
       rt = router,
       parts = path.split('/'),
       sId, parent, parentStateId;

   // Since path is absolute, it always starts with '/', so remove the first
   // element (empty string)
   parts.splice(0, 1);

   // Build an array of routers, from the root to the current one.
   while (rt) {
      routers.unshift(rt);
      rt = rt._parentRouter;
   }

   // Traverse path and routers simultaneously.
   while (!!(sId = parts.shift())) {
      rt = routers.shift();

      if (!rt) {
         rt = _findRouterForStateId(parent, sId, parentStateId);

         // Router doesn't exist, save deferredPath and stop
         if (!rt) {
            _deferredPath = path;
            return newStates;
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
         value: sId
      });
      parent = rt;
      parentStateId = sId;
   }

   return newStates;
}

/**
 * Execute a callback and log if returns false.
 * @private
 * @param  {(function (): (?)|undefined)} callback
 * @param  {!string}   type
 * @param  {string}   stateId
 * @return {boolean}
 */
function _executeCallback(callback, type, stateId) {
   var result = callback();
   if (!result) {
      oj.Logger.info('%s is false for state: %s', type, stateId);
   }

   return result;
}

/**
 * Chain callback into a sequence if it's a function.
 * @private
 * @param  {(function (): (?)|undefined)} callback
 * @param  {IThenable.<?>|null}           sequence
 * @param  {!string}                      type
 * @param  {string}                       stateId
 * @return {IThenable.<?>|null}
 */
function _chainCallback(callback, sequence, type, stateId) {
   // Check if we can enter this new state by executing the callback.
   // If the callback is a function, chain it.
   if (typeof callback === 'function') {
      // Check if this is the start of the chain
      if (!sequence) {
         sequence = new Promise(function(resolve) {
            resolve(_executeCallback(callback, type, stateId));
         });
      }
      else {
         sequence = sequence.then(function(result) {
            // Only test the next state if the previous promise return true
            if (result) {
               result = _executeCallback(callback, type, stateId);
            }

            return result;
         });
      }
   }

   return sequence;
}

/**
 * Traverse the child router and build a chain of promise for each canExit callback.
 * @private
 * @param  {oj.Router} router
 * @param  {IThenable.<?>|null}  sequence
 * @return {IThenable.<?>|null}  chain of promises executing the canExit on the current states
 */
function _buildCanExitSequence(router, sequence) {
   var currentState = router._currentState(),
       canExitCallback,
       i;

   if (currentState) {
      // Traverse each child router and ask for canExit
      for (i = 0; i < router._childRouters.length; i++) {
         sequence = _buildCanExitSequence(router._childRouters[i], sequence);
      }

      // A callback defined on bound viewModel has precedence.
      if (currentState.viewModel && currentState.viewModel['canExit']) {
         canExitCallback = currentState.viewModel['canExit'];
      } else {
         canExitCallback = currentState._canExit;
      }

      sequence = _chainCallback(canExitCallback, sequence, 'canExit', currentState._id);
   }

   return sequence;
}

/**
 * Invoke canExit callbacks in a deferred way.
 * @private
 * @param  {oj.Router} router
 * @return {IThenable.<?>|null} a promise returning true if all of the current state can exit.
 */
function _canExit(router) {
   var sequence;

   if (isTransitionCancelled()) {
      return Promise.resolve(false);
   }

   oj.Logger.info('Start _canExit.');

   if (router) {
      sequence = _buildCanExitSequence(router, null);
      if (sequence === null) {
         sequence = Promise.resolve(true);
      }
      else {
         sequence = sequence.then(function(result) {
            return (result && !isTransitionCancelled());
         });
      }
   }
   else {
      sequence = Promise.resolve(true);
   }

   return sequence;
}

/**
 * Return a promise returning an object with an array of all the changes and the origin if all of
 * the new state in the allChanges array can enter.
 * @private
 * @param {!Array.<{value:string, router:!oj.Router}>} allChanges
 * @param {string=} origin a string specifying the origin of the transition ('sync', 'popState')
 * @return {!Promise} a promise returning an object with an array of all the changes and the origin.
 */
function _canEnter(allChanges, origin) {
   if (isTransitionCancelled()) {
      return Promise.resolve();
   }

   oj.Logger.info('Start _canEnter.');

   var sequence = null;

   // Build a chain of canEnter promise for each state in the array of changes
   allChanges.forEach(function(change) {
      var newState = change.router.stateFromIdCallback(change.value);

      // It is allowed to transition to an undefined state, but no state
      // callback need to be executed.
      if (newState) {
         sequence = _chainCallback(newState._canEnter, sequence, 'canEnter', newState._id);
      }
   });

   if (sequence === null) {
      sequence = Promise.resolve({ allChanges: allChanges, origin: origin });
   }
   else {
      sequence = sequence.then(function(result) {
         var returnObj;

         if (result && !isTransitionCancelled()) {
            returnObj = { allChanges: allChanges, origin: origin };
         }

         return returnObj;
      });
   }

   return sequence;
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
         if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
            oj.Logger.info('Updating state of %s to %s.',
               getRouterFullName(change.router), change.value);
         }
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
 * @private
 * @param {Object} updateObj
 * @return {!Promise}
 */
function _updateAll(updateObj) {
   if (!updateObj) {
      return Promise.resolve(_NO_CHANGE_OBJECT);
   }

   var sequence = Promise.resolve().then(function() {
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
 * Update the state using the current URL.
 * @private
 * @param {string=} origin the transition origin
 * @return a Promise that resolves when the routers state are updated
 */
function parseAndUpdate(origin) {
   var allChanges;

   try {
      allChanges = _urlAdapter.parse();

      // Only keep changes where the value doesn't match the router state
      allChanges = _filterNewState(allChanges);
   }
   catch (error) {
      return Promise.reject(error);
   }

   return _canEnter(allChanges, origin).then(_updateAll);
}

function _logTransition(action, transition) {
   if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
      var path = transition.path ? 'path=' + transition.path : '';
      var deferString = transition.deferredHandling ? 'deferredHandling=true' : '';
      var router = transition.router ? getRouterFullName(transition.router) : 'null';
      oj.Logger.info('>> %s: origin=%s router=%s %s %s',
         action, transition.origin, router, path, deferString);
   }
}

/**
 * Execute a transition. There are 3 types of transitions depending if they are
 * called from go, sync or handlePopState.
 * @private
 * @param  {Object} transition An object with properties describing the transition.
 * @return A Promise that resolves when the router is done with the state transition.
 */
function _executeTransition(transition) {

   _logTransition('Executing', transition);

   if (!transition.deferredHandling) {
      // if the transition originate from a sync call, don't call canExit
      if (transition.origin === 'sync') {
         return parseAndUpdate();
      }
      else if (transition.origin === 'popState') {
         return _canExit(transition.router).then(function (canExit) {
            if (canExit) {
               return parseAndUpdate(transition.origin);
            }
            return Promise.resolve(_NO_CHANGE_OBJECT);
         });
      }
   }
   return transition.router._go(transition);
}

/**
 * Executes first transition on the queue then unqueue then recurse.
 * @private
 */
function _resolveTransition() {
   var transition = _transitionQueue[0],
       promise;

   _logTransition('Resolving', transition);

   if (transition.cancel) {
      _logTransition('Cancelled', transition);
      promise = Promise.resolve(_NO_CHANGE_OBJECT);
   }
   else {
      promise = _executeTransition(transition);
   }

   return promise.then(function(params) {
      var done = _transitionQueue.shift();
      _logTransition('Done with', done);
      if (params[_HAS_CHANGED] === true) {
         // Build the window title that will appear in the browser history
         var titleInfo = _buildTitle(rootRouter);
         var title;

         if (titleInfo.title !== '') {
            title = titleInfo.title;
         }
         else {
            if (_originalTitle && _originalTitle.length > 0) {
               title = _originalTitle;
               if (titleInfo.segment !== '') {
                  title += _TITLE_SEP + titleInfo.segment;
               }
            }
            else {
               title = titleInfo.segment;
            }
         }

         if (title !== window.document.title) {
            window.document.title = title;
         }
      }
      dispatchTransitionedToState(params);
      return params;
   }, function(error) {
      _transitionQueue = [];
      oj.Logger.error('Error when executing transition: %o', (error || 'Unknown'));
      dispatchTransitionedToState(_NO_CHANGE_OBJECT);
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

   _logTransition('Queuing  ', transition);

   // Push new transition at the end. Current transition is always at index 0
   length = _transitionQueue.push(transition);

   // Simple case when the transition is the only one in the queue.
   if (length === 1) {
      _queuePromise = _resolveTransition();
   }
   // Cancel transition in queue and chain it
   else {
      lastTransition = _transitionQueue[length-2];
      // Don't cancel transitions from popstate event or for deferred path
      if (!lastTransition.deferredHandling) {
         _logTransition('Cancelling', lastTransition);
         lastTransition.cancel = true;
      }
      _queuePromise = _queuePromise.then(_resolveTransition);
   }

   return _queuePromise;
}

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
    * The object moduleConfig provides the following functionality to the ojModule binding:
    * <ol>
    *   <li>it defines the name of the module by setting the <code class="prettyprint">name</code>
    * option to the value of the current router state.</li>
    *   <li>it makes the parent router accessible to the module using the
    * <code class="prettyprint">params['ojRouter']['parentRouter']</code> property.</li>
    *   <li>it defines a direction hint that can be use for the module animation.</li>
    *   <li>it makes the callback <code class="prettyprint">canExit</code> invokable on the
    * viewModel. If <code class="prettyprint">canExit</code> is not defined on the viewModel,
    * it will be invoked on the {@link oj.RouterState|RouterState}.</li>
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
    *   <li><code class="prettyprint">lifecycleListener</code>: an object implementing the
    * <code class="prettyprint">attached</code> callback to bind canExit to the router if it is
    * defined on the viewModel. If you override <code class="prettyprint">attached</code>, this
    * functionality will be lost unless you set the viewModel to the current state of the parent
    * router in your custom <code class="prettyprint">attached</code> implementation.</li>
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
                  var paramRouter = ko.unwrap(params['valueAccessor']())['params']['ojRouter']['parentRouter'],
                      state = paramRouter._currentState();
                  if (state) {
                     state.viewModel = params['viewModel'];
                  }
               },
               // User can change attached
               writable: true, enumerable: true
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
 */
rootRouter = new oj.Router(_DEFAULT_ROOT_NAME, undefined, undefined);

/**
 * Function use to handle the popstate event.
 */
function handlePopState() {
   var i, sr;
   var sId = rootRouter._stateId();
   var subRouter = null;

   oj.Logger.info('Handling popState event with URL: %s', _location.href);

   // First retrieve the sub-router associated with the current state, if there is one.
   if (sId) {
      for (i = 0; i < rootRouter._childRouters.length; i++) {
         sr = rootRouter._childRouters[i];
         if (sId === sr._parentState) {
            subRouter = sr;
            break;
         }
      }
   }

   _queueTransition({ router: subRouter, origin: 'popState' });
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
 * @param {string=} option.label the string for the link. This is also used to compose the title of
 * the page when no title property is defined.
 * See the {@link oj.RouterState#label} property.
 * @param {*=} option.value the object associated with this state.
 * See the {@link oj.RouterState#value} property.
 * @param {boolean=} option.isDefault true if this state is the default.
 * See the Router {@link oj.Router#defaultStateId|defaultStateId} property.
 * @param {(string|function():string)=} option.title the string to be used for the title of the page.
 * See the {@link oj.RouterState#title} property.
 * @param {(function(): boolean|function(): Promise.<boolean>)=} option.canEnter A callback that either
 * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
 * The default value is a method that always returns true.
 * See the {@link oj.RouterState#canEnter} property.
 * @param {(function()|function(): Promise)=} option.enter A callback or the
 * promise of a callback which execute when entering this state.
 * See the {@link oj.RouterState#enter} property.
 * @param {(function(): boolean|function(): Promise.<boolean>)=} option.canExit  A callback that either
 * returns a boolean or the Promise of a boolean. If the boolean is true the transition will continue.
 * The default value is a method that always returns true.
 * See the {@link oj.RouterState#canExit} property.
 * @param {(function()|function(): Promise)=} option.exit A callback or the
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

      _urlAdapter.init(_baseUrlProp);

      _originalTitle = window.document.title;

      /**
       * Listen to URL changes caused by back/forward button
       * using the popstate event. Call handlePopState to dispatch the change of URL.
       */
      window.addEventListener(_POPSTATE, handlePopState, false);

      oj.Logger.info('Initializing rootInstance.');
      oj.Logger.info('Base URL is %s', _baseUrlProp);
      oj.Logger.info('Current URL is %s', _location.href);

      _initialized = true;
   }
}

/**
 * Go is used to transition to a new state using a path made of state ids separated by a slash.  The
 * path can be absolute or relative.<br>
 * <br>
 * Example of valid path:
 * <ul>
 *   <li><code class="prettyprint">router.go('home')</code>: transition router
 *    to state id 'home'</li>
 *   <li><code class="prettyprint">router.go('/book/chapt2')</code>: transition
 *    the root instance to state id 'book' and the child router to state id
 *    'chapt2'</li>
 *   <li><code class="prettyprint">router.go('chapt2/edit')</code>: transition
 *   router to state id 'chapt2' and child router to state id 'edit'</li>
 * </ul>
 * <br>
 * If the stateIdPath argument is <code class="prettyprint">undefined</code> or an empty string, go
 * transition to the default state of the router.<br>
 * A {@link oj.Router.transitionedToState|transitionedToState} signal is
 * dispatched when the state transition has completed.
 * @param {string=} stateIdPath A path of ids representing the state to
 * transition to.
 * @param {Object=} options - an object with additional information on how to execute the transition.
 * @param {string} options.historyUpdate Specify how the transition should act on the browser
 * history. If this property is not specified, a new URL is added to the history.<br>
 * <b><i>Supported Values:</i></b><br>
 * <code class="prettyprint">'skip'</code>: does not update the history with the new URL<br>
 * <code class="prettyprint">'replace'</code>: modifies the current history with the new URL
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
 * @example <caption>Transition a router to state id 'stepB' without updating the URL:</caption>
 * wizardRouter.go('stepB', { historyUpdate: 'skip' });
 */
oj.Router.prototype.go = function(stateIdPath, options) {
   _initialize();

   options = options || [];

   return _queueTransition({ router: this, path: stateIdPath, origin: 'go',
                             historyUpdate: options['historyUpdate'] });
};

/**
 * Internal go used by _executeTransition
 * @private
 * @param  {Object} transition An object with properties describing the transition
 * @return {*} A Promise that resolves when the routing is done
 */
oj.Router.prototype._go = function(transition) {
   var path,
       newStates,
       useDefault = true,
       stateIdPath = transition.path,
       replace = false,
       skip = false;

   switch (transition.historyUpdate) {
      case 'skip':
         skip = true;
         break;
      case 'replace':
         replace = true;
   }

   if (stateIdPath) {
      if (typeof stateIdPath === 'string') {
         useDefault = false;
      }
      else {
         return Promise.reject(new Error('Invalid object type for state id.'));
      }
   }

   if (useDefault) {
      stateIdPath = this._defaultStateId;
      if (!stateIdPath) {
         // No default defined, so nowhere to go.
         if (oj.Logger.option('level') === oj.Logger.LEVEL_INFO) {
            oj.Logger.info('Undefined state id with no default id on router %s',
                        getRouterFullName(this));
         }
         return Promise.resolve(_NO_CHANGE_OBJECT);
      }
   }

   // Absolute or relative?
   if ('/' === stateIdPath.charAt(0)) {
      path = stateIdPath;
   }
   else {
      path = getCurrentPath(this._parentRouter);
      if (!path) {
         return Promise.reject(new Error('Invalid path "' + stateIdPath +
                               '". The parent router does not have a current state.'));
      }
      path += stateIdPath;
   }

   oj.Logger.info('Destination path: %s', path);

   try {
      newStates = _buildStateFromPath(this, path);
      newStates = _appendOtherChanges(newStates);
   }
   catch (err) {
      return Promise.reject(err);
   }

   // It is important that we do not call canEnter on state that we not going to enter so
   // only keep changes where the value doesn't match the current router state.
   // reducedState is an array of object with 2 properties, value and router.
   var reducedState = _filterNewState(newStates);

   // Only transition if replace is true or if the new state is different.
   // When replace is true, it is possible the states are the same (by example when going to the
   // default state of a child router) but the transition still need to be executed.
   if (replace || reducedState.length > 0) {
      oj.Logger.info('Deferred mode or new state is different.');
      return _canExit(this).then(function (canExit) {
         if (canExit) {
            // Only calls canEnter callback on state that are changing
            return _canEnter(reducedState).then(_updateAll).then(function(params) {
               if (params[_HAS_CHANGED]) {
                  if (skip) {
                     oj.Logger.info('Skip history update.');
                  }
                  else {
                     var url = _urlAdapter.buildUrlFromStates(newStates);
                     oj.Logger.info('%s URL to %s', replace ? 'Replacing' : 'Pushing', url);
                     window.history[replace ? 'replaceState' : 'pushState'](null, '', url);
                  }
               }
               return params;
            });
         }
         return Promise.resolve(_NO_CHANGE_OBJECT);
      });
   }

   return Promise.resolve(_NO_CHANGE_OBJECT);
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
      if (router._extra !== undefined) {
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
            if (sr._extra !== undefined) {
               extraState[sr._name] = sr._extra;
            }
            nextLevel = sr;
            break;
         }
      }
      router = nextLevel;
      nextLevel = undefined;
   }

   window.history.replaceState(null, '', _buildUrl({}, extraState));
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
      _baseUrlProp = '/'; // Restore the default value
      _urlAdapter = null;
      this._name = _DEFAULT_ROOT_NAME;
      // Restore title
      window.document.title = _originalTitle;

      window.removeEventListener(_POPSTATE, handlePopState);
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
 * @property {string} baseUrl the base URL to be used for relative URL addresses. The value can be
 * absolute or relative.  If not specified, the default value is '/'.<br>
 * <b>Warning</b>: When using the {@link oj.Router.urlPathAdapter|path URL adapter} it is necessary
 * to set the base URL if your application is not using <code class="prettyprint">index.html</code>
 * or is not starting at the root folder. Using the base URL is the only way the router can retrieve
 * the part of the URL representing the state.<br>
 * @property {string} rootInstanceName the name used for the root router. If not defined,
 * the name is 'root'. This is used by the {@link oj.Router.urlParamAdapter|urlParamAdapter} to build
 * the URL in the form of <code class="prettyprint">/index.html?root=book</code>.
 * @export
 * @example <caption>Change the default URL adapter to the urlParamAdapter</caption>
 * oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();
 * @example <caption>Set the base URL for an application located at the root and a starting page
 * named <code class="prettyprint">index.html</code>. This is the default.</caption>
 * oj.Router.defaults['baseUrl'] = '/';
 * @example <caption>Set the base URL for an application with a page named
 * <code class="prettyprint">main.html</code> and located in the
 * <code class="prettyprint">/myApp</code> folder.</caption>
 * oj.Router.defaults['baseUrl'] = '/myApp/main.html';
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
         return _baseUrlProp;
      },
      set: function(baseUrl) {
         if (_initialized) {
            throw new Error('Incorrect operation. Cannot change base URL after calling sync() or go().');
         }
         if (!baseUrl) {
            _baseUrlProp = '/';
         }
         else {
            // Remove anything after ? or #
            _baseUrlProp = baseUrl.match(/[^?#]+/)[0];
         }
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
   var transition = { router: rootRouter, origin: 'sync' };

   _initialize();

   oj.Logger.info('Entering sync with URL: %s', _location.href);

   if (_deferredPath) {
      transition.path = _deferredPath;
      transition.deferredHandling = true;
      transition.historyUpdate = 'replace';
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
    * Variable to store the base path. This is used to retrieve the portion of the path
    * representing the routers state.
    * @ignore
    * @type {!string}
    */
   var _basePath = '';

   /**
    * Initialize the adapter given the baseUrlProp.
    * For the urlPathAdapter, retrieve the potential file name to handle application with
    * index.html in their URL.
    * @ignore
    * @param {!string} baseUrlProp the value of oj.Router.defaults.baseUrl
    */
   this.init = function(baseUrlProp) {
      // Use the browser parser to get the pathname. It works with absolute or relative URL.
      var parser = document.createElement('a');
      parser.href = baseUrlProp;

      var path = parser.pathname;
      path = path.replace(/^([^\/])/,'/$1');  // Should always start with slash (for IE)

      // Normalize the base path. Always ends with a '/'
      if (path.slice(-1) !== '/') {
         path = path + '/';
      }

      _basePath = path;
   };

   /**
    * Construct an array of states where each item is an object made of a router and
    * the new state for it.
    * @ignore
    * @return {!Array.<{value:string, router:!oj.Router}>}
    * @throws Error when parsing of router param fails.
    */
   this.parse = function() {
      var router = rootRouter,
          // To retrieve the portion of the path representing the routers state,
          // remove the base portion of the path.
          path =  _location.pathname.replace(_basePath, ''),
          segments = path.split('/'),
          changes = [],
          stateStr, value;

      oj.Logger.info('Parsing: %s', path);

      while (router && (value = segments.shift())) {
         changes.push({ value: value, router: router });
         router = _getChildRouter(router, value);
      }

      changes = _appendOtherChanges(changes);

      // Retrieve the extra state from request param oj_Router
      stateStr = _location.search.split(_ROUTER_PARAM)[1];
      if (stateStr) {
         stateStr = stateStr.split('&')[0];
         if (stateStr) {
            changes.forEach(_updateBookmarkableData, decodeStateParam(stateStr));
         }
      }

      return changes;
   };

   /**
    * Given an ordered array of states, build the URL representing all
    * the states.
    * Never starts with a '/': "book"  "book/chapter2"
    * @ignore
    * @param {!Array.<{router:!oj.Router, value:string}>} newStates
    * @return {!string} the URL representing the states
    */
   this.buildUrlFromStates = function(newStates) {
      var ns,
          canDefault = false,
          pathname = '',
          extraState = {}; // Compound object of all extra states


      // Build the new URL by walking the array of states backward in order to eliminate
      // the default state from the URL. As soon as a value is not the default, stops the removal.
      while (!!(ns = newStates.pop())) {
         if (ns.value) {
            if (canDefault || (ns.value !== ns.router._defaultStateId)) {
               if (pathname === '') {
                  pathname = ns.value;
               }
               else {
                  pathname = ns.value + '/' + pathname;
               }
               canDefault = true;
            }
         }

         // Build an object made of the extra data of each router
         if (ns.router._extra !== undefined) {
            extraState[ns.router._name] = ns.router._extra;
         }
      }

      return _buildUrl({ pathname: _basePath + pathname }, extraState);
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
    * Initialize the adapter.
    * @ignore
    */
    this.init = function() {
      // No-op
    };

   /**
    * Construct an array of states where each item is an object made of a router and
    * the new state for it.
    * @ignore
    * @return {!Array.<{value:string, router:!oj.Router}>}
    * @throws Error when parsing of router param fails.
    */
   this.parse = function() {
      var search = _location.search,
          params = parseQueryParam(search),
          router = rootRouter,
          changes = [],
          stateStr, value;

      oj.Logger.info('Parsing: %s', search);

      while (router) {
         value = params[router._name];
         if (value) {
            value = value[0];
         }

         value = value || router._defaultStateId;
         if (value) {
            changes.push({ value: value, router: router });
         }
         router = _getChildRouter(router, value);
      }

      changes = _appendOtherChanges(changes);

      // Retrieve the extra state from oj_Router param
      stateStr = params['oj_Router'];
      if (stateStr) {
         changes.forEach(_updateBookmarkableData, decodeStateParam(stateStr[0]));
      }

      return changes;
   };

   /**
    * Given an ordered array of states, build the URL representing all
    * the states.
    * Never starts with a '/': "index.html", "book/chapter2"
    * @ignore
    * @param {!Array.<{router:!oj.Router, value:string}>} newStates
    * @return {!string} the URL representing the states
    * @throws An error if bookmarkable state is too big.
    */
   this.buildUrlFromStates = function(newStates) {
      var ns,
          canDefault = false,
          search = '',
          extraState = {}; // Compound object of all extra states

      // Build the new URL by walking the array of states backward in order to eliminate
      // the default state from the URL. As soon as a value is not the default, stops the removal.
      while (!!(ns = newStates.pop())) {
         if (ns.value) {
            if (canDefault || (ns.value !== ns.router._defaultStateId)) {
               search = '&' + ns.router._name + '=' + ns.value + search;
               canDefault = true;
            }
         }

         // Build an object made of the extra data of each router
         if (ns.router._extra !== undefined) {
            extraState[ns.router._name] = ns.router._extra;
         }
      }

      // Replace first parameter separator from '&' to '?'
      if (search) {
         search = '?' + search.substr(1);
      }

      return _buildUrl({ search: search }, extraState);
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
    * @param {(function(): boolean|function(): Promise.<boolean>)=} options.canEnter A callback that
    * either returns a boolean or the Promise of a boolean. If the boolean is true the transition
    * will continue.
    * The default value is a method that always returns true.
    * See the {@link oj.RouterState#canEnter} property.
    * @param {(function()|function(): Promise)=} options.enter A callback or
    * the promise of a callback which execute when entering this state.
    * See the {@link oj.RouterState#enter} property.
    * @param {(function(): boolean|function(): Promise.<boolean>)=} options.canExit  A callback that
    * either returns a boolean or the Promise of a boolean. If the boolean is true the transition
    * will continue.
    * The default value is a method that always returns true.
    * See the {@link oj.RouterState#canExit} property.
    * @param {(function()|function(): Promise)=} options.exit A callback or
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
       * @type {function():boolean|function():Promise.<boolean>}
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
       * @type {function()|function():Promise}
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
       * @type {function():boolean|function():Promise.<boolean>}
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
       * @type {function()|function():Promise}
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
       * This is also used to build the title of the page when the {@link oj.RouterState#title}
       * property is not defined. The title will be composed of the labels of all current
       * states in the router hierarchy like "My Page | label lvl1 | label lvl2".
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
       * The string to be used for the page title. This can either be a string or a function
       * returning a string. When more than one level of child router is defined, the title of
       * the current state of the router nested the deepest has precedence. If the leaf router
       * current state does not have a title property defined, the title of the current state of
       * the parent router is used. If no title property is defined in the router hierarchy, a
       * title is built using the {@link oj.RouterState#label} property.
       * @name oj.RouterState#title
       * @type {string|function():string|undefined}
       */
      this._title = options['title'];

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
         'title': {
            get: function () { return this._title; },
            set: function(newValue) { this._title = newValue; },
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
