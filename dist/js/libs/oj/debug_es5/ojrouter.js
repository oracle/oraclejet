/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'knockout', 'signals', 'ojs/ojlogger'], function(oj, ko, signals, Logger)
{
  "use strict";


/* jslint browser: true*/

/* global oj, ko, Promise, signals, Logger:false */

/**
 * The ojRouter module.
 */
// Wrap in a IIFE to prevents the possiblity of collision in a non-AMD scenario.
(function () {
  'use strict';
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
   * @type {oj.Router.urlPathAdapter|oj.Router.urlParamAdapter}
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

  var _ROUTER_PARAM = 'oj_Router';
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

  var _NO_CHANGE_OBJECT = {
    hasChanged: false
  };
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
   * The name of the object containing state parameters.
   * @private
   */

  var _parametersValue = 'parameters';
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
    var params = {}; // Remove starting '?'

    var trimmedQueryString = queryString.split('?')[1];

    if (trimmedQueryString) {
      var keyValPairs = trimmedQueryString.split('&');
      keyValPairs.forEach(function (pair) {
        var parts = pair.split(/=(.+)?/);
        var key = parts[0];

        if (key.length) {
          var value = parts[1] && decodeURIComponent(parts[1]);
          params[key] = value;
        }
      });
    }

    return params;
  }
  /**
   * Takes a path of segment separated by / and returns an array of segments
   * @param  {string=} path a path of segment separated by /
   * @return {!Array} an array of segment
   */


  function _getSegments(path) {
    var array = path ? path.split('/') : [];
    return array;
  }
  /**
   * Returns the first segment of a path separated by /
   * @param  {string=} id
   * @return {string}
   */


  function _getShortId(id) {
    var segment = _getSegments(id)[0];

    return _decodeSlash(segment);
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
    } // Add or replace the existing state param


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

      router._states.every(function (stateAt) {
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
    var path;

    if (router) {
      path = getCurrentPath(router._parentRouter);

      if (path) {
        var sId = router._stateId();

        if (sId) {
          path += sId + '/';
        } else {
          path = undefined;
        }
      }
    } else {
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

    router._childRouters.every(function (sr) {
      // If child router doesn't have _parentState, then it was created before
      // the parent router navigated to a state, and so it's used as the default
      // child router.  There can only be one child router per parent state (even
      // if the parent state is "undefined"), so we should only ever encounter,
      // at most, one sub-router whose parent state is undefined.
      if (!sr._parentState) {
        subRouter = sr;
      } else if (sr._parentState === value) {
        // Otherwise, if a specific subrouter matches the queried value, then use
        // it instead of the default.
        subRouter = sr; // Once found, exit the loop right away.  There can be only one child
        // router per parent state, so the first one we find will be the only
        // one.

        return false;
      }

      return true;
    });

    return subRouter;
  }
  /**
   * Only keep changes where the value doesn't match the current router state
   * @private
   * @param {!Array.<_StateChange>} changes
   * @return {!Array.<_StateChange>}
   */


  function _filterNewState(changes) {
    var newChanges = changes.filter(function (change) {
      return change.value !== change.router._stateId();
    });

    if (Logger.option('level') === Logger.LEVEL_INFO) {
      Logger.info('Potential changes are: ');
      newChanges.forEach(function (change) {
        Logger.info('   { router: %s, value: %s }', change.router && getRouterFullName(change.router), change.value);
      });
    }

    return newChanges;
  }
  /**
   * Update the bookmarkable data
   * @private
   * @this {!Object.<string, Object>}
   * @param {?Object} change
   */


  function _updateBookmarkableData(change) {
    var ex = this[change.router._name];

    if (ex !== undefined) {
      // eslint-disable-next-line no-param-reassign
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
    return _transitionQueue[0] && _transitionQueue[0].cancel;
  }
  /**
   * Encode and compress the a state object. This is used for bookmarkable data.
   * @private
   * @param {!Object.<string, Object>} extraState
   * @return {!string}
   * @throws An error if bookmarkable state is too big.
   */


  function encodeStateParam(extraState) {
    var jsonState = JSON.stringify(extraState);
    var encodedState = encodeURIComponent(jsonState);
    var compressedState = oj.LZString.compressToEncodedURIComponent(jsonState);
    var useCompressed = false;
    var param = _ROUTER_PARAM + '=';

    if (compressedState.length <= encodedState.length) {
      useCompressed = true;
    }

    if (useCompressed) {
      param += '1' + compressedState;
    } else {
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
    var extraState; // First character is the compression type. Right now only 0 and 1 are supported.
    // 0 for no compression, 1 for LZW

    var compressionType = param.charAt(0);
    var decodedParam = param.slice(1);

    if (compressionType === '0') {
      decodedParam = decodeURIComponent(decodedParam);
    } else if (compressionType === '1') {
      decodedParam = oj.LZString.decompressFromEncodedURIComponent(decodedParam);
    } else {
      throw new Error('Error retrieving bookmarkable data. Format is invalid');
    }

    extraState =
    /** @type {!Object.<string, Object>} */
    JSON.parse(decodedParam);

    if (Logger.option('level') === Logger.LEVEL_INFO) {
      Logger.info('Bookmarkable data: ');
      var names = Object.keys(extraState);

      for (var i = 0; i < names.length; i++) {
        var name = names[i];
        Logger.info('   { router: %s, value: %s }', name, extraState[name]);
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
    var startSegment;
    var endSegment;
    var start = url.indexOf(_ROUTER_PARAM);

    if (start !== -1) {
      var end = url.indexOf('&', start);

      if (end === -1) {
        end = url.length;
      }

      startSegment = url.substring(0, start);
      endSegment = url.substr(end);
    } else {
      startSegment = url + (url.indexOf('?') === -1 ? '?' : '&');
      endSegment = '';
    }

    if (extraState && Object.getOwnPropertyNames(extraState).length > 0) {
      stateParam = encodeStateParam(extraState);
    } else {
      // Remove the '?' or '&'
      startSegment = startSegment.substring(0, startSegment.length - 1);
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

    router._childRouters.every(function (child) {
      if ((!child._parentState || child._parentState === parentStateId) && child._getStateFromId(sId)) {
        result = child;
        return false;
      }

      return true;
    });

    return result;
  }
  /**
   * Traverse the tree of routers and build an array of states made of the router and an
   * undefined value.
   * The first item of the array is the root and the last is the leaf.
   * @private
   * @param  {oj.Router} router
   */


  function _buildAllUndefinedState(router) {
    var states = [];

    if (router._currentState()) {
      // Push a state change with undefined value (2nd argument in constructor missing)
      states.push(new _StateChange(router));

      router._childRouters.forEach(function (child) {
        states = states.concat(_buildAllUndefinedState(child));
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
      return {
        title: '',
        segment: ''
      };
    } // Recurse leaf first


    var titleInfo = _buildTitle(_getChildRouter(router, router._stateId())); // If we don't have a title yet, build one.


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
        } else {
          // Otherwise, compose the title with the label
          title = state._label;

          if (title !== undefined) {
            title = String(title); // Append existing segment

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
   * @param {Object} param
   * @param {boolean} param.haschanged
   * @param {oj.Router=} param.router
   * @param {oj.RouterState=} param.oldState
   * @param {oj.RouterState=} param.newState
   */


  function dispatchTransitionedToState(param) {
    oj.Router._transitionedToState.dispatch(param);
  }
  /**
   * An object use to represent a change in a RouterState
   * @constructor
   * @param {!oj.Router} router
   * @param {string=} value
   * @private
   * @ojtsignore
   */


  function _StateChange(router, value) {
    this.router = router;
    this.value = value; // the value is also the stateId
  }
  /**
   * Returns the RouterState object for the state id in this change object
   * @return {oj.RouterState} the RouterState matching the value
   * @private
   */


  _StateChange.prototype.getState = function () {
    if (!this.state) {
      if (this.value) {
        this.state = this.router._getStateFromId(_getShortId(this.value));
      }
    }

    return this.state;
  };
  /**
   * Store a state parameter value by appending it to the value as a path
   * @param {string=} value
   * @private
   */


  _StateChange.prototype.addParameter = function (value) {
    if (value) {
      this.value += '/' + value;
    }
  };
  /**
   * Takes an array of changes from parsing and appends other changes needed to be done.
   * 1) All cascading default state
   * 2) All the state that need to become undefined
   * @private
   * @param {!Array.<_StateChange>} states
   * @return {!Array.<_StateChange>}
   */


  function _appendOtherChanges(states) {
    var lastItem = states[states.length - 1];
    var router;
    var value; // If there is a state, starts with it

    if (lastItem) {
      router = lastItem.router;
      value = _getShortId(lastItem.value);
    } else {
      // Otherwise, starts at the root router
      router = rootRouter;
      value = rootRouter._defaultStateId;

      if (value) {
        states.push(new _StateChange(router, value));
      }
    } // Append all the default states all the way to the leaf router


    router = _getChildRouter(router, value);

    while (router) {
      value = router._defaultStateId;

      if (value) {
        states.push(new _StateChange(router, value));
      }

      router = _getChildRouter(router, value);
    } // Build an array of all the state to become undefined due to the parent state changing. The
    // order of execution is leaf first.


    var undefStates = _buildAllUndefinedState(rootRouter); // First build an array of undefined state


    var undef = [];
    undefStates.forEach(function (select, i) {
      var change = states[i]; // Only insert change for a different router since the undef change will already happen when
      // a router transition to a different state.

      if (!change || select.router !== change.router) {
        undef.unshift(select);
      }
    }); // The order of execution is exit(undef) from leaf to root followed by enter from root to leaf

    var resultStates = undef.concat(states);
    return resultStates;
  }
  /**
   * Build an array of objects by visiting the parent hierarchy.
   * Each element of the array represent the state of a router.
   * @private
   * @param {!oj.Router} router
   * @param {!string} path
   * @return {!Array.<_StateChange>}
   */


  function _buildStateFromPath(router, path) {
    var newStates = [];
    var routers = [];
    var rt = router;

    var parts = _getSegments(path);

    var parent;
    var parentStateId;
    var state;
    var stateChange;
    var pi = 0; // Since path is absolute, it always starts with '/', so remove the first
    // element (empty string)

    parts.splice(0, 1); // Build an array of routers, from the root to the current one.

    while (rt) {
      routers.unshift(rt);
      rt = rt._parentRouter;
    } // Traverse path and routers simultaneously.


    for (var sId = parts.shift(); sId; sId = parts.shift()) {
      if (state) {
        var pName = state._paramOrder[pi]; // If state has parameters, save the state Id as the parameter value

        if (pName) {
          stateChange.addParameter(sId);
          pi += 1;
        } else {
          // Otherwise, reset parameter index
          pi = 0;
        }
      }

      if (!state || pi === 0) {
        rt = routers.shift();

        if (!rt) {
          rt = _findRouterForStateId(parent, sId, parentStateId); // Router doesn't exist, save deferredPath and stop

          if (!rt) {
            _deferredPath = path;
            return newStates;
          }
        }

        stateChange = new _StateChange(rt, sId);
        state = stateChange.getState();

        if (!state) {
          throw new Error('Invalid path "' + path + '". State id "' + sId + '" does not exist on router "' + rt._name + '".');
        }

        newStates.push(stateChange);
        parent = rt;
        parentStateId = sId;
      }
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
      Logger.info('%s is false for state: %s', type, stateId);
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
        // eslint-disable-next-line no-param-reassign
        sequence = new Promise(function (resolve) {
          resolve(_executeCallback(callback, type, stateId));
        });
      } else {
        // eslint-disable-next-line no-param-reassign
        sequence = sequence.then(function (result) {
          // Only test the next state if the previous promise return true
          if (result) {
            // eslint-disable-next-line no-param-reassign
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
    var currentState = router._currentState();

    if (currentState) {
      // Traverse each child router and ask for canExit
      for (var i = 0; i < router._childRouters.length; i++) {
        // eslint-disable-next-line no-param-reassign
        sequence = _buildCanExitSequence(router._childRouters[i], sequence);
      } // A callback defined on bound viewModel has precedence.


      var canExitCallback;

      if (currentState.viewModel && currentState.viewModel.canExit) {
        canExitCallback = currentState.viewModel.canExit;
      } else {
        canExitCallback = currentState._canExit;
      } // eslint-disable-next-line no-param-reassign


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

    Logger.info('Start _canExit.');

    if (router) {
      sequence = _buildCanExitSequence(router, null);

      if (sequence === null) {
        sequence = Promise.resolve(true);
      } else {
        sequence = sequence.then(function (result) {
          return result && !isTransitionCancelled();
        });
      }
    } else {
      sequence = Promise.resolve(true);
    }

    return sequence;
  }
  /**
   * Return a promise returning an object with an array of all the changes and the origin if all of
   * the new state in the allChanges array can enter.
   * @private
   * @param {!Array.<_StateChange>} allChanges
   * @param {string=} origin a string specifying the origin of the transition ('sync', 'popState')
   * @return {!Promise} a promise returning an object with an array of all the changes and the origin.
   */


  function _canEnter(allChanges, origin) {
    if (isTransitionCancelled()) {
      return Promise.resolve();
    }

    Logger.info('Start _canEnter.');
    var sequence = null; // Build a chain of canEnter promise for each state in the array of changes

    allChanges.forEach(function (change) {
      var newState = change.getState(); // It is allowed to transition to an undefined state, but no state
      // callback need to be executed.

      if (newState) {
        sequence = _chainCallback(newState._canEnter, sequence, 'canEnter', newState._id);
      }
    });

    if (sequence === null) {
      sequence = Promise.resolve({
        allChanges: allChanges,
        origin: origin
      });
    } else {
      sequence = sequence.then(function (result) {
        var returnObj;

        if (result && !isTransitionCancelled()) {
          returnObj = {
            allChanges: allChanges,
            origin: origin
          };
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
    var oldState = change.router._getStateFromId(_getShortId(change.router._stateId()));

    var newState = change.getState();
    return Promise.resolve().then(function () {
      if (Logger.option('level') === Logger.LEVEL_INFO) {
        Logger.info('Updating state of %s to %s.', getRouterFullName(change.router), change.value);
      }
    }) // Execute exit on the current state
    .then(oldState ? oldState._exit : undefined).then(function () {
      var rt = change.router;
      var goingBackward = false; // Are we going back to the previous state?

      if (origin === 'popState') {
        var length = rt._navHistory.length;
        var i; // Are we going back to the previous state?

        for (i = length - 1; i >= 0; i--) {
          if (rt._navHistory[i] === change.value) {
            goingBackward = true; // Delete all elements up the one matching

            rt._navHistory.splice(i, length - i);

            break;
          }
        } // Back only if going back 1


        if (length - i === 1) {
          rt._navigationType = 'back';
        }
      }

      if (!goingBackward) {
        delete rt._navigationType;

        rt._navHistory.push(_getShortId(rt._stateId()));
      } // Update the parameters


      if (change.value && newState) {
        var segments = _getSegments(change.value);

        newState._paramOrder.forEach(function (name, ii) {
          var newValue = _decodeSlash(segments[ii + 1]);

          var oldValue = newState[_parametersValue][name]; // Update the parameter value

          if (newValue !== oldValue) {
            newState[_parametersValue][name] = newValue;
          }
        }); // TODO: Should we execute a callback for case where state doesn't change
        //      and using a configure with function? or disable for function configure?

      } // Change the value of the stateId


      rt._stateId(change.value);
    }) // Execute enter on the new state
    .then(newState ? newState._enter : undefined);
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

    var sequence = Promise.resolve().then(function () {
      Logger.info('Entering _updateAll.');
      oj.Router._updating = true;
    });
    var oldState;
    var allChanges = updateObj.allChanges;
    allChanges.forEach(function (change) {
      oldState = change.router.currentState.peek();
      sequence = sequence.then(function () {
        if (!isTransitionCancelled()) {
          return _update(change, updateObj.origin);
        }

        return undefined;
      });
    });
    return sequence.then(function () {
      var hasChanged = false;
      var router;
      var newState;

      if (allChanges.length) {
        hasChanged = !isTransitionCancelled();
        /*
         * Pass the last state of a multi-state transition as the new state to
         * which we're transitioning.
         */

        var change = allChanges[allChanges.length - 1];
        router = change.router;
        newState = change.state;
      }

      oj.Router._updating = false;
      Logger.info('_updateAll returns %s.', String(hasChanged));
      return {
        hasChanged: hasChanged,
        router: router,
        oldState: oldState,
        newState: newState
      };
    }, function (error) {
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
      allChanges = _urlAdapter.parse(); // Only keep changes where the value doesn't match the router state

      allChanges = _filterNewState(allChanges);
    } catch (error) {
      return Promise.reject(error);
    }

    return _canEnter(allChanges, origin).then(_updateAll);
  }
  /**
   * Log the action and transaction as Logger.info.
   * @param       {string} action     The action performed
   * @param       {Object} transition The router transition.  The transition object
   * contains the following properties:
   * - {string} path The path to where the transition is occurring
   * - {string} origin The origin of the transition.  Will be one of, "sync", "go",
   *   "popState"
   * - {oj.Router} router The instance of the router performing the transition
   * - {string} historyUpdate A string indicating how the router should update the
   *   browser history.  Possible values are, "skip" or "replace"
   *   updated
   * @private
   */


  function _logTransition(action, transition) {
    if (Logger.option('level') === Logger.LEVEL_INFO) {
      var path = transition.path ? 'path=' + transition.path : '';
      var deferString = transition.deferredHandling ? 'deferredHandling=true' : '';
      var router = transition.router ? getRouterFullName(transition.router) : 'null';
      Logger.info('>> %s: origin=%s router=%s %s %s', action, transition.origin, router, path, deferString);
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
      } else if (transition.origin === 'popState') {
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
    var transition = _transitionQueue[0];
    var promise;

    _logTransition('Resolving', transition);

    if (transition.cancel) {
      _logTransition('Cancelled', transition);

      promise = Promise.resolve(_NO_CHANGE_OBJECT);
    } else {
      promise = _executeTransition(transition);
    }

    return promise.then(function (params) {
      var done = _transitionQueue.shift();

      _logTransition('Done with', done);

      if (params[_HAS_CHANGED] === true) {
        // Build the window title that will appear in the browser history
        var titleInfo = _buildTitle(rootRouter);

        var title;

        if (titleInfo.title !== '') {
          title = titleInfo.title;
        } else if (_originalTitle && _originalTitle.length > 0) {
          title = _originalTitle;

          if (titleInfo.segment !== '') {
            title += _TITLE_SEP + titleInfo.segment;
          }
        } else {
          title = titleInfo.segment;
        }

        if (title !== window.document.title) {
          window.document.title = title;
        }
      }

      dispatchTransitionedToState(params);
      return params;
    }, function (error) {
      _transitionQueue = [];
      Logger.error('Error when executing transition: %o', error);
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
    _logTransition('Queuing  ', transition); // var path = transition.path;
    // var bc = oj.Context.getPageContext().getBusyContext();
    // Disabling the state due to  - OJ.TESTS.ROUTER.SAMPLEOJMODULETEST FAILS
    // var removeBusyState = bc.addBusyState({description:'router transitioning to new state "'+path+'"'});
    // Push new transition at the end. Current transition is always at index 0


    var length = _transitionQueue.push(transition); // Simple case when the transition is the only one in the queue.


    if (length === 1) {
      _queuePromise = _resolveTransition();
    } else {
      // Cancel transition in queue and chain it
      var lastTransition = _transitionQueue[length - 2]; // Don't cancel transitions from popstate event or for deferred path

      if (!lastTransition.deferredHandling) {
        _logTransition('Cancelling', lastTransition);

        lastTransition.cancel = true;
      }

      _queuePromise = _queuePromise.then(_resolveTransition);
    }

    return _queuePromise; // .then(function(result) {
    //     removeBusyState();
    //     return result;
    // }, function(error) {
    //     removeBusyState();
    //     return _queuePromise;
    // });
  }
  /**
   * @class
   * @requires ojs/ojcore
   * @since 1.1.0
   * @ojtsmodule
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
   *       Logger.error('Error when starting router: ' + error.message);
   *    });
   * </code></pre>
   *
   * <h6>Trigger a state transition when user ask to navigate:</h6>
   * <pre class="prettyprint"><code>
   * &lt;div id="routing-container">
   *    &lt;div id='buttons-container'>
   *      &lt;oj-bind-for-each data="[[router.states]]">
   *        &lt;template>
   *          &lt;!-- Use the go function of the state as the handler for a click binding -->
   *          &lt;oj-button :id="[[$current.data.id]]" on-oj-action="[[go]]">
   *            &lt;oj-bind-text value="[[$current.data.label]]">&lt;/oj-bind-text>
   *          &lt;/oj-button>
   *        &lt;/template>
   *      &lt;/oj-bind-for-each>
   *    &lt;/div>
   * &lt;/div>
   * </code></pre>
   *
   * <h6>Listen to the state change and updates the dependent parts:</h6>
   * <pre class="prettyprint"><code>
   * &lt;!-- Display the content of the current state -->
   * &lt;h2 id="pageContent">
   *   &lt;oj-bind-text value="[[router.currentValue]]">&lt;/oj-bind-text>
   * &lt;/h2>
   * </code></pre>
   *
   * @desc
   * A Router cannot be instantiated. A static Router is created when the module is loaded and can be
   * accessed using the method {@link oj.Router.rootInstance|rootInstance}.
   * A child router can be created using the method {@link oj.Router#createChildRouter|createChildRouter}.
   * @see oj.Router.rootInstance
   * @see oj.Router#createChildRouter
   * @constructor
   * @hideconstructor
   * @export
   * @ojtsimport knockout
   * @ojtsimport signals
   * @ojtsimport {module: "ojrouterstate", type: "AMD", imported:["RouterState"]}
   */


  oj.Router = function (key, parentRouter, parentState) {
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

    this._parentState = parentState || (parentRouter ? _getShortId(parentRouter._stateId()) : undefined);
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
     * &lt;oj-buttonset-one value="{{router.stateId}}">
     *    &lt;oj-bind-for-each data="[[router.states]]">
     *      &lt;template>
     *        &lt;oj-option value="[[$current.data.id]]">
     *          &lt;span>&lt;oj-bind-text value="$current.data.label">&lt;/oj-bind-text>&lt;/span>
     *        &lt;/oj-option>
     *      &lt;/template>
     *    &lt;/oj-bind-for-each>
     * &lt;/oj-buttonset-one&gt;
     *
     */

    this._stateIdComp = ko.pureComputed({
      read: function read() {
        // Return only the significant part of the id, the part without the state parameters.
        return _getShortId(this._stateId());
      },
      write: function write(value) {
        this.go(value).then(null, function (error) {
          throw error;
        });
      },
      owner: router
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
     *    &lt;oj-bind-if test="[[router.currentState()]]"&gt;
     *       &lt;!-- content of the panel --&gt;
     *    &lt;/oj-bind-if&gt;
     */

    this._currentState = ko.pureComputed(function () {
      var shortId = _getShortId(router._stateId());

      return ko.ignoreDependencies(router._getStateFromId, router, [shortId]);
    });
    /**
     * A Knockout observable on the value property of the current state.<br>
     * The state value property is the part of the state object that will be used in the application.
     * It is a shortcut for <code class="prettyprint">router.currentState().value;</code>
     * @name oj.Router#currentValue
     * @type {function():(string|undefined)}
     * @readonly
     *
     * @example <caption>Display the content of the current state:</caption>
     * &lt;h2 id="pageContent">
     *   &lt;oj-bind-text value="[[router.currentValue]]">&lt;/oj-bind-text>
     * &lt;/h2>
     */

    this._currentValue = ko.pureComputed(function () {
      var shortId = _getShortId(router._stateId());

      var retValue;
      var currentState = ko.ignoreDependencies(router._getStateFromId, router, [shortId]);

      if (currentState) {
        retValue = currentState.value;
      }

      return retValue;
    });
    /**
     * The current navigation direction of the router, used for module animations.
     * The value will either be undefined if navigating forward, or "back" if
     * navigating backwards.
     * This is the same value available as part of {@link oj.Router#moduleConfig|moduleConfig}.
     * @name oj.Router#direction
     * @type {string|undefined}
     * @readonly
     * @since 5.0.0
     *
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
     * @private
     */

    function _RouterParams() {
      Object.defineProperties(this, {
        parentRouter: {
          value: router,
          enumerable: true
        },
        direction: {
          get: function get() {
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
     *
     * @name oj.Router#moduleConfig
     * @type {Object}
     * @readonly
     * @property {ko.Observable<string>} name
     * @property {Object} params
     * @property {Object} params.ojRouter
     * @property {oj.Router} params.ojRouter.parentRouter
     * @property {string} params.ojRouter.direction
     * @property {Object} lifecycleListener
     * @property {function(any):void} lifecycleListener.attached
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
     */


    this._moduleConfig = Object.create(null, {
      name: {
        value: ko.pureComputed(function () {
          var retValue; // ojModule name cannot afford to be null

          var stateId = _getShortId(this._stateId()) || this._defaultStateId || this._states[0].name;

          var currentState = this._getStateFromId(stateId);

          if (currentState) {
            retValue = currentState.value;

            if (!retValue || typeof retValue !== 'string') {
              retValue = currentState._id;
            }
          }

          return retValue;
        }, router),
        enumerable: true
      },
      params: {
        value: Object.create(null, {
          ojRouter: {
            value: new _RouterParams(),
            enumerable: true
          }
        }),
        enumerable: true
      },
      lifecycleListener: {
        value: {
          attached: function attached(params) {
            var state = router.currentState();

            if (state) {
              state.viewModel = params.viewModel;
            }
          },
          enumerable: true
        },
        enumerabl: true
      }
    });
    /**
     * @typedef {object} oj.Router.ModuleConfigType
     * @property {ko.Observable<string>} name The value of the current state.  See {@link oj.Router#currentValue}
     * @property {Object} params
     * @property {Object} params.ojRouter
     * @property {oj.Router} params.ojRouter.parentRouter A reference to the current router
     * @property {string} params.ojRouter.direction The animation direction of the module, if defined.
     * @property {Object} params.ojRouter.parameters An object containing the observable parameters of the current router state.
     * @property {Object} lifecycleListener
     * @property {function(any):void} lifecycleListener.attached The 'attached' listener for the module
     * @ojsignature [{ target: "Type", value: "{[key:string]:any}", for: "params.ojRouter.parameters" }]
     */

    /**
     * Similar to {@link oj.Router#moduleConfig}, this object is meant to be used to configure
     * a module binding which reacts to changes in the router state or its parameters.
     * This configuration also creates observables around all of the
     * {@link oj.RouterState#parameters} found in the router state.
     <p>
     This observable is dyanmically created only when it's first requested.  To
     use observableModuleConfig and its observable parameters, first reference
     the property in your own code, which
     will setup the observable and add observable state parameters.  To use
     the observable parameters, retrieve the instance from the parameters passed
     to your view model.
     </p>
     @example <caption>Use observable parameters</caption>
     var root = oj.Router.rootInstance;
     root.configure(...);
     var mc = root.observableModuleConfig;
     ...
     function ViewModel(viewParams) {
        var router = viewParams['ojRouter']['parentRouter'];
        var currentState = router.currentState();
        // Retrieve object containing observable parameters
        var params = viewParams['ojRouter']['parameters'];
        var employeeId = params['employeeId'];
        // Get an observable parameter's value
        var idValue = employeeId();
          // Optionally subscribe to a parameter's value change
        employeeId.subscribe(function(newId) {
        });
     }
     * @name oj.Router#observableModuleConfig
     * @type {Object}
     * @since 4.2.0
     * @readonly
     *
     * @ojsignature {target: "Type", value: "ko.Observable<oj.Router.ModuleConfigType>", jsdocOverride: true}
     */

    this._getObservableModuleConfig = function () {
      if (!this._observableModuleConfig) {
        var stateObservable = router.currentState;
        var initialState = stateObservable.peek();
        var omc = ko.observable(_getConfigObject(initialState, router)); // Subscribe to the changes and update omc appropriately

        stateObservable.subscribe(function (state) {
          var omcObject = omc.peek();
          var oldName = omcObject.name;

          var newName = _getNameFromState(state);

          if (oldName !== newName) {
            omc(_getConfigObject(state, router)); // all new config value when the name changes
          } else {
            // update parameters only
            _updateConfigObject(state, omcObject);
          }
        });
        this._observableModuleConfig = omc;
      }

      return this._observableModuleConfig;
    };

    function _getConfigObject(currentState, _router) {
      var obj = {
        name: _getNameFromState(currentState),
        params: {
          ojRouter: {
            parentRouter: _router,

            get direction() {
              return _router._navigationType;
            }

          }
        }
      };
      obj.params.ojRouter[_parametersValue] = {};

      if (currentState) {
        _updateConfigObject(currentState, obj);

        obj.lifecycleListener = {
          attached: _router.moduleConfig.lifecycleListener.attached
        };
      }

      return obj;
    }

    function _updateConfigObject(currentState, config) {
      var params = config.params.ojRouter[_parametersValue];
      var stateParams = currentState[_parametersValue];
      var paramKeys = Object.keys(stateParams);
      paramKeys.forEach(function (paramKey) {
        var value = stateParams[paramKey];
        var setter = params[paramKey];

        if (!setter) {
          setter = ko.observable();
          params[paramKey] = setter;
        }

        setter(value);
      });
    }

    function _getNameFromState(currentState) {
      var name = 'oj-blank'; // deal with empty state

      if (currentState) {
        name = currentState.value;

        if (!name || typeof name !== 'string') {
          name = currentState._id;
        }

        return name;
      }

      return undefined;
    }

    Object.defineProperties(this, {
      parent: {
        /**
         * The parent router if it exits.
         * Only the 'root' router does not have a parent router.
         * @name oj.Router#parent
         * @member
         * @type {oj.Router|undefined}
         * @readonly
         */
        value: this._parentRouter,
        enumerable: true
      }
    });
  };

  Object.defineProperties(oj.Router.prototype, {
    name: {
      get: function get() {
        return this._name;
      },
      enumerable: true
    },
    states: {
      get: function get() {
        return this._states;
      },
      enumerable: true
    },
    stateId: {
      get: function get() {
        return this._stateIdComp;
      },
      enumerable: true
    },
    currentState: {
      get: function get() {
        return this._currentState;
      },
      enumerable: true
    },
    currentValue: {
      get: function get() {
        return this._currentValue;
      },
      enumerable: true
    },
    direction: {
      get: function get() {
        return this._navigationType;
      },
      enumerable: true
    },
    defaultStateId: {
      get: function get() {
        return this._defaultStateId;
      },
      set: function set(newValue) {
        this._defaultStateId = newValue;
      },
      enumerable: true
    },
    moduleConfig: {
      get: function get() {
        return this._moduleConfig;
      },
      enumerable: true
    },
    observableModuleConfig: {
      get: function get() {
        return this._getObservableModuleConfig();
      },
      enumerable: true
    }
  });
  /**
   * Create the instance of the root router.
   */

  rootRouter = new oj.Router(_DEFAULT_ROOT_NAME, undefined, undefined);
  /**
   * Function use to handle the popstate event.
   */

  function handlePopState() {
    var sId = _getShortId(rootRouter._stateId());

    var subRouter = null;
    Logger.info('Handling popState event with URL: %s', _location.href); // First retrieve the sub-router associated with the current state, if there is one.

    if (sId) {
      for (var i = 0; i < rootRouter._childRouters.length; i++) {
        var sr = rootRouter._childRouters[i];

        if (sId === sr._parentState) {
          subRouter = sr;
          break;
        }
      }
    }

    _queueTransition({
      router: subRouter,
      origin: 'popState'
    });
  }
  /**
   * Return a child router by name.  The name is the value given to
   * {@link oj.Router#createChildRouter|createChildRouter}.
   * @param  {!string} name The name of of the child router to find
   * @return {oj.Router|undefined} The child router
   * @since 1.2.0
   * @export
   */


  oj.Router.prototype.getChildRouter = function (name) {
    var childRouter;

    if (name && typeof name === 'string') {
      var trimmedName = name.trim();

      if (trimmedName.length > 0) {
        this._childRouters.every(function (sr) {
          if (sr._name === trimmedName) {
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
   * Get the child router associated with the parent's current state.  See
   * {@link oj.Router#createChildRouter|createChildRouter} for details on how child routers are associated
   * with parent states.
   * @return {oj.Router|undefined} The child router for the current state, if defined.
   * @since 5.0.0
   * @export
   *
   */


  oj.Router.prototype.getCurrentChildRouter = function () {
    var sId = _getShortId(this._stateId() || this._defaultStateId);

    var child = _getChildRouter(this, sId);

    return child;
  };
  /**
   * Create a child router with the given name. A router can either have one child
   * router that handles all possible states, or one child router per state.
   * See the examples below.
   * @param {!string} name The unique name representing the router.  The name is
   * used by the function {@link oj.Router#getChildRouter|getChildRouter} to retrieve
   * the child router.
   * @param {string=} parentStateId The state Id of the parent router for determining
   * when this child router is used.
   * If not defined, the child router is created for the current state of the router.
   * @return {oj.Router} the child router
   * @throws An error if a child router exist with the same name or if the current
   * state already has a child router.
   * @export
   * @example <caption>
   * <b>Create a default child router for the parent</b>
   * In this example, the parent router is assumed to have no current state (it
   * has not yet navigated to any particular state). Since we are not specifying a
   * value for parentStateId, the newly created router will be the default child
   * router.
   * </caption>
   * // Parent router has no current state
   * router = oj.Router.rootInstance;
   * // This child router is the default child router for all parent router states
   * childRouter = router.createChildRouter('chapter');
   * @example <caption>
   * <b>Create a child router for the root's current state</b>
   * In this example, the parent has navigated to a state before the child router
   * is created.  Even though no value is given for parentStateId, the child router
   * is only used when the parent is in the particular state.
   * </caption>
   * // Parent router navigates to a given state
   * router = oj.Router.rootInstance;
   * router.go('book').then(function(result) {
   *   if (result.hasChanged) {
   *     // Child router is only used when parent router's state is 'book'
   *     // because parent now has a current state
   *     var childRouter = router.createChildRouter('chapter');
   *   }
   * });
   * @example <caption>
   * <b>Create a child router for parent state id 'book'</b>
   * In this example, the parent router hasn't yet navigated to a particular state
   * but the child specifies 'book' as its parentStateId, therefore, the child will
   * only be used when the parent is in that particular state.
   * </caption>
   * // Parent router has no current state
   * router = oj.Router.rootInstance;
   * // Child router is only used when parent router's state is 'book'
   * childRouter = router.createChildRouter('chapter', 'book');
   */


  oj.Router.prototype.createChildRouter = function (name, parentStateId) {
    var childRouter;
    oj.Assert.assertString(name);

    var _parentStateId = parentStateId || _getShortId(this._stateId());

    var encodedName = encodeURIComponent(name.trim()); // Make sure it doesn't already exist.

    for (var i = 0; i < this._childRouters.length; i++) {
      var sr = this._childRouters[i];

      if (sr._name === encodedName) {
        throw new Error('Invalid router name "' + encodedName + '", it already exists.');
      } else if (sr._parentState === _parentStateId) {
        throw new Error('Cannot create more than one child router for parent state id "' + sr._parentState + '".');
      }
    }

    childRouter = new oj.Router(encodedName, this, _parentStateId);

    this._childRouters.push(childRouter);

    return childRouter;
  };
  /**
   * @private
   * @param {string} stateId The state id.
   * @return {oj.RouterState | undefined} The state object.
   */


  oj.Router.prototype._getStateFromId = function (stateId) {
    var state;

    if (this._stateFromIdCallback) {
      state = this._stateFromIdCallback(stateId); // If return is a config object, instantiate RouterState with it

      if (state && !(state instanceof oj.RouterState)) {
        state = new oj.RouterState(stateId, state, this);
      }
    } else {
      state = getStateFromId(this, stateId);
    }

    return state;
  };
  /**
   * Configure the states of the router. The router can be configured in two ways:
   * <ul>
   *  <li>By describing all of the possible states that can be taken by this router.</li>
   *  <li>By providing a callback returning a {@link oj.RouterState|RouterState}
   *      object given a string state id.</li>
   * </ul>
   * This operation resets any previous configuration, and is chainable.<br>
   * Configuring {@link oj.RouterState#parameteters router state parameters} should
   * be done here.  See the example below.
   *
   * @param {!(Object.<string, {oj.RouterState.ConfigOptions}> |
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
   * defining the state.  Note that the forward slash character '/' is not allowed
   * in the state Id.  See {@link oj.RouterState~ConfigOptions|ConfigOptions}.<br>See first example below.
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
   *    <tr>
   *      <td class="type">
   *        <span class="param-type">oj.RouterState.ConfigOptions</span>
   *      </td>
   *      <td class="value">
   *        <span class="param-type">See {@link oj.RouterState~ConfigOptions|ConfigOptions}
   *        for the options available for configuring router states</span>
   *      </td>
   *   </tbody>
   * </table>
   * @return {Router}
   * @export
   * @see oj.RouterState
   * @ojsignature { target:'Type',
   *              value: '{[key:string]: oj.RouterState.ConfigOptions}|((id:string)=> oj.RouterState|oj.RouterState.ConfigOptions|undefined|null)',
   *              for: 'option'}
   * @example <caption>Add three states with id 'home', 'book' and 'tables':</caption>
   * router.configure({
   *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
   *    'book':   { label: 'Book',   value: 'bookContent' },
   *    'tables': { label: 'Tables', value: 'tablesContent' }
   * });
   * @example <caption>Configure dynamic states via callback function:</caption>
   * router.configure(function(stateId) {
   *    var state;
   *
   *    if (stateId) {
   *       state = new oj.RouterState(stateId, { value: data[stateId] }, router);
   *    }
   *    return state;
   * });
   * @example <caption>Configuring {@link oj.RouterState#parameters state parameters}:</caption>
   * router.configure({
   *    'home':   { label: 'Home',   value: 'homeContent', isDefault: true },
   *    'book/{chapter}/{paragraph}':   { label: 'Book',   value: 'bookContent' },
   * });
   */


  oj.Router.prototype.configure = function (option) {
    this._stateId(undefined);

    delete this._defaultStateId; // StateId are changing so erase history.

    this._navigationType = undefined;
    this._navHistory = [];

    if (typeof option === 'function') {
      this._states = null; // Override prototype

      this._stateFromIdCallback = option;
    } else {
      this._states = [];
      this._stateFromIdCallback = undefined;
      Object.keys(option).forEach(function (key) {
        var rsOptions = option[key];

        this._states.push(new oj.RouterState(key, rsOptions, this)); // Set the defaultStateId of the router from the isDefault property


        if (typeof rsOptions.isDefault === 'boolean' && rsOptions.isDefault) {
          this._defaultStateId = _getShortId(key);
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


  oj.Router.prototype.getState = function (stateId) {
    return this._getStateFromId(stateId);
  };
  /**
   * Initialize the default for oj.Router if needed. Dispose on the root router
   * will de-initialize.
   * @private
   */


  function _initialize() {
    if (!_initialized) {
      if (!_urlAdapter) {
        // eslint-disable-next-line new-cap
        _urlAdapter = new oj.Router.urlPathAdapter();
      }

      _urlAdapter.init(_baseUrlProp);

      _originalTitle = window.document.title;
      /**
       * Listen to URL changes caused by back/forward button
       * using the popstate event. Call handlePopState to dispatch the change of URL.
       */

      window.addEventListener(_POPSTATE, handlePopState, false);
      Logger.info('Initializing rootInstance.');
      Logger.info('Base URL is %s', _baseUrlProp);
      Logger.info('Current URL is %s', _location.href);
      _initialized = true;
    }
  }
  /**
   * Convert forward slash characters used for paths to a character which doesn't
   * require URL encoding (to save space in the URL) and is unambiguous from the
   * path separator.
   * @param       {string} value The string whose slash characters are to be encoded.
   * @return      {string}      An encoded form of the string
   * @private
   */


  function _encodeSlash(value) {
    var enc = value;

    if (enc && enc.replace) {
      enc = enc.replace(/~/g, '~0');
      enc = enc.replace(/\//g, '~1');
    }

    return enc;
  }
  /**
   * Given an encoded string from _encodeSlash, decode the characters to restore
   * the value to its original form.
   * @param       {string} value The string whose encoded slash values will be decoded.
   * @return      {string}      The decoded form of the string
   * @private
   */


  function _decodeSlash(value) {
    var dec = value;

    if (dec && dec.replace) {
      dec = dec.replace(/~1/g, '/');
      dec = dec.replace(/~0/g, '~');
    }

    return dec;
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
   *   <li><code class="prettyprint">router.go(['chapt2','edit'])</code>: equivalent
   *   to the previous transition, but using an array of path strings in place of
   *   forward slashes.
   * </ul>
   * <br>
   * If the stateIdPath argument is <code class="prettyprint">undefined</code> or an empty string, go
   * transition to the default state of the router.<br>
   * A {@link oj.Router.transitionedToState|transitionedToState} signal is
   * dispatched when the state transition has completed.
   * @param {(string|Array.<string>)=} stateIdPath A path of ids representing the state to
   * which to transition, separated by forward slashes (/).  This can also be an Array
   * of strings, each segment representing individual states.  An array is typically used
   * if the forward slash should be part of the state Id and needs to be distinguished
   * from the path separators.
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
   *          Logger.info('Router transitioned to default state.');
   *       }
   *       else {
   *          Logger.info('No transition, Router was already in default state.');
   *       }
   *    },
   *    function(error) {
   *       Logger.error('Transition to default state failed: ' + error.message);
   *    }
   * );
   * @example <caption>Transition a router to state id 'stepB' without updating the URL:</caption>
   * wizardRouter.go('stepB', { historyUpdate: 'skip' });
   */


  oj.Router.prototype.go = function (stateIdPath, options) {
    _initialize();

    var optionsWithDefault = options || {};

    if (Array.isArray(stateIdPath)) {
      // eslint-disable-next-line no-param-reassign
      stateIdPath = stateIdPath.map(_encodeSlash).join('/');
    }

    return _queueTransition({
      router: this,
      path: stateIdPath,
      origin: 'go',
      historyUpdate: optionsWithDefault.historyUpdate
    });
  };
  /**
   * Internal go used by _executeTransition
   * @private
   * @param  {Object} transition An object with properties describing the transition
   * @return {any} A Promise that resolves when the routing is done
   */


  oj.Router.prototype._go = function (transition) {
    var newStates;
    var useDefault = true;
    var stateIdPath = transition.path;
    var replace = false;
    var skip = false;

    switch (transition.historyUpdate) {
      case 'skip':
        skip = true;
        break;

      case 'replace':
        replace = true;
        break;

      default:
        break;
    }

    if (stateIdPath) {
      if (typeof stateIdPath === 'string') {
        useDefault = false;
      } else {
        return Promise.reject(new Error('Invalid object type for state id.'));
      }
    }

    if (useDefault) {
      stateIdPath = this._defaultStateId;

      if (!stateIdPath) {
        // No default defined, so nowhere to go.
        Logger.info(function () {
          return 'Undefined state id with no default id on router ' + getRouterFullName(this);
        });
        return Promise.resolve(_NO_CHANGE_OBJECT);
      }
    }

    var path; // Absolute or relative?

    if (stateIdPath.charAt(0) === '/') {
      path = stateIdPath;
    } else {
      path = getCurrentPath(this._parentRouter);

      if (!path) {
        return Promise.reject(new Error('Invalid path "' + stateIdPath + '". The parent router does not have a current state.'));
      }

      path += stateIdPath;
    }

    Logger.info('Destination path: %s', path);

    try {
      newStates = _buildStateFromPath(this, path);
      newStates = _appendOtherChanges(newStates);
    } catch (err) {
      return Promise.reject(err);
    } // It is important that we do not call canEnter on state that we not going to enter so
    // only keep changes where the value doesn't match the current router state.
    // reducedState is an array of object with 2 properties, value and router.


    var reducedState = _filterNewState(newStates); // Only transition if replace is true or if the new state is different.
    // When replace is true, it is possible the states are the same (by example when going to the
    // default state of a child router) but the transition still need to be executed.


    if (replace || reducedState.length > 0) {
      Logger.info('Deferred mode or new state is different.');
      return _canExit(this).then(function (canExit) {
        if (canExit) {
          // Only calls canEnter callback on state that are changing
          return _canEnter(reducedState).then(_updateAll).then(function (params) {
            if (params[_HAS_CHANGED]) {
              if (skip) {
                Logger.info('Skip history update.');
              } else {
                var url = _urlAdapter.buildUrlFromStates(newStates);

                Logger.info('%s URL to %s', replace ? 'Replacing' : 'Pushing', url);
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
   * @return {undefined}
   * @export
   * @ojsignature [{ target: "Type", for: "data", value: "{[key:string]:any}" }]
   * @example <caption>Store a color in the URL:</caption>
   * try {
   *    var color = '#99CCFF';
   *    router.store(color);
   *    $('#chapter').css('background', color);
   * }
   * catch (error) {
   *    Logger.error('Error while storing data: ' + error.message);
   * }
   */


  oj.Router.prototype.store = function (data) {
    this._extra = data;
    var extraState = {};
    var router = this; // Walk the parent routers

    while (router) {
      if (router._extra !== undefined) {
        extraState[router._name] = router._extra;
      }

      router = router._parentRouter;
    } // and the children routers


    router = this;
    var nextLevel;

    while (router) {
      for (var i = 0; i < router._childRouters.length; i++) {
        var sr = router._childRouters[i];

        var shortId = _getShortId(router._stateId());

        if (shortId && shortId === sr._parentState) {
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
   * @return {any} the content stored in the URL
   * @ojsignature [{ target: "Type", for: "returns", value: "{[key:string]:any}" }]
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
   *        Logger.error('Error during sync: ' + error.message);
   *     }
   *  );
   */


  oj.Router.prototype.retrieve = function () {
    return this._extra;
  };
  /**
   * Dispose the router.<br>
   * Erase all states of this router and its children.
   * Remove itself from parent router child list.<br>
   * When this method is invoked on the {@link oj.Router.rootInstance|rootInstance}, it
   * also remove internal event listeners and re-initialize the
   * {@link oj.Router.defaults|defaults}.
   * @return {undefined}
   * @export
   */


  oj.Router.prototype.dispose = function () {
    // Depth first
    while (this._childRouters.length > 0) {
      this._childRouters[0].dispose();
    } // If this is the root, clean up statics


    if (!this._parentRouter) {
      _baseUrlProp = '/'; // Restore the default value

      _urlAdapter = null;
      this._name = _DEFAULT_ROOT_NAME; // Restore title

      window.document.title = _originalTitle;
      window.removeEventListener(_POPSTATE, handlePopState);

      oj.Router._transitionedToState.removeAll();

      _initialized = false;
    } else {
      // Remove itself from parent children array.
      var parentChildren = this._parentRouter._childRouters;

      for (var i = 0; i < parentChildren.length; i++) {
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
    rootInstance: {
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
      value: rootRouter,
      enumerable: true
    },
    transitionedToState: {
      /**
       * A {@link http://millermedeiros.github.io/js-signals/|signal} dispatched when the state transition
       * has completed either by successfully changing the state or cancelling.<br>
       * The parameter of the event handler is a boolean true when the state has changed.<br>
       * This is usefull when some post processing is needed or to test the result after a state change.
       * @name oj.Router.transitionedToState
       * @type {signals.Signal}
       * @readonly
       * @example <caption>Creates promise that resolve when the state transition is complete.</caption>
       * var promise = new Promise(function(resolve, reject) {
       *       oj.Router.transitionedToState.add(function(result) {
       *          if (result.hasChanged) {
       *             Logger.info('The state has changed');
       *          }
       *          resolve();
       *       });
       */
      value: oj.Router._transitionedToState,
      enumerable: true
    }
  });
  /**
   * A set of Router defaults properties.<br>
   * <h6>Warning: </h6>Defaults can not be changed after the first call to {@link oj.Router.sync|sync()}
   * has been made. To re-initialize the router, you need to call {@link oj.Router#dispose|dispose()} on
   * the {@link oj.Router.rootInstance|rootInstance} first then change the defaults.
   * @property {oj.Router.urlPathAdapter|oj.Router.urlParamAdapter} [urlAdapter] an instance of the url adapter to use. If not specified, the router
   * will be using the path url adapter. Possible values are an instance of
   * {@link oj.Router.urlPathAdapter} or {@link oj.Router.urlParamAdapter}.
   * @property {string} [baseUrl] the base URL to be used for relative URL addresses. The value can be
   * absolute or relative.  If not specified, the default value is '/'.<br>
   * <b>Warning</b>: When using the {@link oj.Router.urlPathAdapter|path URL adapter} it is necessary
   * to set the base URL if your application is not using <code class="prettyprint">index.html</code>
   * or is not starting at the root folder. Using the base URL is the only way the router can retrieve
   * the part of the URL representing the state.<br>
   * @property {string} [rootInstanceName] the name used for the root router. If not defined,
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
    urlAdapter: {
      get: function get() {
        if (!_urlAdapter) {
          // eslint-disable-next-line new-cap
          _urlAdapter = new oj.Router.urlPathAdapter();
        }

        return _urlAdapter;
      },
      set: function set(urlAdapter) {
        if (_initialized) {
          throw new Error('Incorrect operation. Cannot change URL adapter after calling sync() or go().');
        }

        _urlAdapter = urlAdapter;
      },
      enumerable: true,
      readonly: false
    },
    baseUrl: {
      get: function get() {
        return _baseUrlProp;
      },
      set: function set(baseUrl) {
        if (_initialized) {
          throw new Error('Incorrect operation. Cannot change base URL after calling sync() or go().');
        }

        if (!baseUrl) {
          _baseUrlProp = '/';
        } else {
          // Remove anything after ? or #
          _baseUrlProp = baseUrl.match(/[^?#]+/)[0];
        }
      },
      enumerable: true,
      readonly: false
    },
    rootInstanceName: {
      get: function get() {
        return rootRouter._name;
      },
      set: function set(rootName) {
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
   *       Logger.error('Error when starting the router: ' + error.message);
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
   *        Logger.error('Error during sync: ' + error.message);
   *     }
   *  );
   *
   */

  oj.Router.sync = function () {
    var transition = {
      router: rootRouter,
      origin: 'sync'
    };

    _initialize();

    Logger.info('Entering sync with URL: %s', _location.href);

    if (_deferredPath) {
      transition.path = _deferredPath;
      transition.deferredHandling = true;
      transition.historyUpdate = 'replace';
      _deferredPath = undefined;
      return _queueTransition(transition);
    }

    if (oj.Router._updating) {
      Logger.info('Sync called while updating, waiting for updates to end.'); // Returms a promise that resolve as soon as the current transition is complete.

      return new Promise(function (resolve) {
        oj.Router._transitionedToState.addOnce(function (result) {
          Logger.info('Sync updates done.');
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
   * adapter used by the {@link oj.Router|router} as it makes more human-readable URLs,
   * is user-friendly, and less likely to exceed the maximum charaacter limit in the
   * browser URL.
   * <br>Since this adapter generates path URLs, it's advisable that your application
   * be able to restore the page should the user bookmark or reload the page.  For
   * instance, given the URL <code class="prettyprint">/book/chapter2</code>, your
   * application server ought to serve up content for "chapter2" if the user should
   * bookmark or reload the page.  If that's not possible, then consider using the
   * {@link oj.Router.urlParamAdapter|urlParamAdapter}.
   * <br>There are two available URL adapters,
   * this one and the {@link oj.Router.urlParamAdapter|urlParamAdapter}.<br>To change
   * the URL adapter, use the {@link oj.Router.defaults|urlAdapter} property.
   * @see oj.Router.urlParamAdapter
   * @see oj.Router.defaults
   * @constructor
   * @export
   * @memberof oj.Router
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

    this.init = function (baseUrlProp) {
      // Use the browser parser to get the pathname. It works with absolute or relative URL.
      var parser = document.createElement('a');
      parser.href = baseUrlProp;
      var path = parser.pathname;
      path = path.replace(/^([^/])/, '/$1'); // Should always start with slash (for IE)
      // Normalize the base path. Always ends with a '/'

      if (path.slice(-1) !== '/') {
        path += '/';
      }

      _basePath = path;
    };
    /**
     * Construct an array of states where each item is an object made of a router and
     * the new state for it.
     * @ignore
     * @return {!Array.<_StateChange>}
     * @throws Error when parsing of router param fails.
     */


    this.parse = function () {
      var router = rootRouter; // To retrieve the portion of the path representing the routers state,
      // remove the base portion of the path.

      var path = _location.pathname.replace(_basePath, '');

      var segments = _getSegments(decodeURIComponent(path)).map(_decodeSlash);

      var changes = [];
      Logger.info('Parsing: %s', path);

      while (router) {
        var value = segments.shift();

        if (!value) {
          break;
        }

        var stateChange = new _StateChange(router, value);
        var state = stateChange.getState(); // If this state has parameters, the following segments are parameter values

        if (state) {
          // eslint-disable-next-line no-loop-func
          state._paramOrder.forEach(function () {
            // Retrieve the next segment and use it for the parameter value
            stateChange.addParameter(segments.shift());
          });
        }

        changes.push(stateChange);
        router = _getChildRouter(router, value);
      }

      changes = _appendOtherChanges(changes); // Retrieve the extra state from request param oj_Router

      var stateStr = _location.search.split(_ROUTER_PARAM + '=')[1];

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
     * @param {!Array.<_StateChange>} newStates
     * @return {!string} the URL representing the states
     */


    this.buildUrlFromStates = function (newStates) {
      var canDefault = false;
      var pathname = '';
      var extraState = {}; // Compound object of all extra states
      // Build the new URL by walking the array of states backward in order to eliminate
      // the default state from the URL. As soon as a value is not the default, stops the removal.

      for (var ns = newStates.pop(); ns; ns = newStates.pop()) {
        if (ns.value) {
          if (canDefault || ns.value !== ns.router._defaultStateId) {
            pathname = pathname ? ns.value + '/' + pathname : ns.value;
            canDefault = true;
          }
        } // Build an object made of the extra data of each router


        if (ns.router._extra !== undefined) {
          extraState[ns.router._name] = ns.router._extra;
        }
      }

      return _buildUrl({
        pathname: _basePath + pathname
      }, extraState);
    };
  };
  /**
   * @class
   * @since 1.1.0
   * @classdesc Url adapter used by the {@link oj.Router} to manage URL in the form of
   * <code class="prettyprint">/index.html?root=book&book=chapter2</code>.  This adapter
   * can be used if the {@link oj.Router.urlPathAdapter|urlPathAdapter} doesn't meet
   * the application's needs.
   * <br>This adapter is well-suited for single-page applications whose entry point
   * is always a single document, i.e., "index.html" which restores its router state
   * from additional parameters.  The router state is encoded as URL parameters and
   * then restored after the page is loaded.  This is ideal for applications which
   * cannot handle multiple entry points, as recommended by {@link oj.Router.urlPathAdapter|urlPathAdapter}.
   * <br>There are two available
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
    this.init = function () {// No-op
    };
    /**
     * Construct an array of states where each item is an object made of a router and
     * the new state for it.
     * @ignore
     * @return {!Array.<_StateChange>}
     * @throws Error when parsing of router param fails.
     */


    this.parse = function () {
      var search = _location.search;
      var params = parseQueryParam(search);
      var router = rootRouter;
      var changes = [];
      Logger.info('Parsing: %s', search);

      while (router) {
        var value = params[router._name] || router._defaultStateId; // Retrieve all value separated by '/'

        var segments = _getSegments(value);

        value = segments.shift();
        var stateChange = new _StateChange(router, value);

        if (value) {
          var state = stateChange.getState(); // If this state has parameters, retrieve their values from the segments

          if (state) {
            // eslint-disable-next-line no-loop-func
            state._paramOrder.forEach(function () {
              stateChange.addParameter(segments.shift());
            });
          }

          changes.push(stateChange);
        }

        router = _getChildRouter(router, value);
      }

      changes = _appendOtherChanges(changes); // Retrieve the extra state from oj_Router param

      var stateStr = params[_ROUTER_PARAM];

      if (stateStr) {
        changes.forEach(_updateBookmarkableData, decodeStateParam(stateStr));
      }

      return changes;
    };
    /**
     * Given an ordered array of states, build the URL representing all
     * the states.
     * Never starts with a '/': "index.html", "book/chapter2"
     * @ignore
     * @param {!Array.<_StateChange>} newStates
     * @return {!string} the URL representing the states
     * @throws An error if bookmarkable state is too big.
     */


    this.buildUrlFromStates = function (newStates) {
      var canDefault = false;
      var search = '';
      var extraState = {}; // Compound object of all extra states
      // Build the new URL by walking the array of states backward in order to eliminate
      // the default state from the URL. As soon as a value is not the default, stops the removal.

      for (var ns = newStates.pop(); ns; ns = newStates.pop()) {
        if (ns.value) {
          if (canDefault || ns.value !== ns.router._defaultStateId) {
            // _name is already encoded
            var paramName = '&' + ns.router._name + '=';
            var paramValue = ns.value; // Because we are traversing the array backward, insert instead of append

            search = paramName + encodeURIComponent(paramValue) + search;
            canDefault = true;
          }
        } // Build an object made of the extra data of each router


        if (ns.router._extra !== undefined) {
          extraState[ns.router._name] = ns.router._extra;
        }
      } // Replace first parameter separator from '&' to '?'


      if (search) {
        search = '?' + search.substr(1);
      }

      return _buildUrl({
        search: search
      }, extraState);
    };
  };

  return rootRouter;
})(); // eslint-disable-next-line no-unused-vars


var Router = oj.Router;



/* eslint-disable no-bitwise */

/* The purpose of this file is compression which by its nature is bit banging */

/**
 * Utility to compress JSON to store on the URL.
 */
(function () {
  var _fcc = String.fromCharCode;
  var _keyStrUriSafe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$';

  var _baseReverseDic;

  oj.LZString = {
    /**
     * Compress into a string that is URI encoded
     * @ignore
     * @param {?string} input
     * @return {string}
     */
    compressToEncodedURIComponent: function compressToEncodedURIComponent(input) {
      if (input === null) {
        return '';
      }

      return _compress(input, 6, function (a) {
        return _keyStrUriSafe.charAt(a);
      });
    },

    /**
     * Decompress from an output of compressToEncodedURIComponent
     * @ignore
     * @param {?string} input
     * @return {?string}
     */
    decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(input) {
      if (input === null) {
        return '';
      }

      if (input === '') {
        return null;
      }

      return _decompress(input.length, 32, function (index) {
        return _getBaseValue(_keyStrUriSafe, input.charAt(index));
      });
    }
  };
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

    var i;
    var value;
    var contextDictionary = {};
    var contextDictionaryToCreate = {};
    var contextW = '';
    var contextEnlargeIn = 2; // Compensate for the first entry which should not count

    var contextDictSize = 3;
    var contextNumBits = 2;
    var contextDataString = '';
    var contextDataVal = 0;
    var contextDataPosition = 0;
    var len = uncompressed.length;

    for (var ii = 0; ii < len; ii++) {
      var contextC = uncompressed[ii];

      if (!Object.prototype.hasOwnProperty.call(contextDictionary, contextC)) {
        contextDictionary[contextC] = contextDictSize;
        contextDictSize += 1;
        contextDictionaryToCreate[contextC] = true;
      }

      var contextWc = contextW + contextC;

      if (Object.prototype.hasOwnProperty.call(contextDictionary, contextWc)) {
        contextW = contextWc;
      } else {
        if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
          if (contextW.charCodeAt(0) < 256) {
            for (i = contextNumBits; i--;) {
              contextDataVal <<= 1;

              if (contextDataPosition === bitsPerChar - 1) {
                contextDataPosition = 0;
                contextDataString += getCharFromInt(contextDataVal);
                contextDataVal = 0;
              } else {
                contextDataPosition += 1;
              }
            }

            value = contextW.charCodeAt(0);

            for (i = 8; i--;) {
              contextDataVal = contextDataVal << 1 | value & 1;

              if (contextDataPosition === bitsPerChar - 1) {
                contextDataPosition = 0;
                contextDataString += getCharFromInt(contextDataVal);
                contextDataVal = 0;
              } else {
                contextDataPosition += 1;
              }

              value >>= 1;
            }
          } else {
            value = 1;

            for (i = contextNumBits; i--;) {
              contextDataVal = contextDataVal << 1 | value;

              if (contextDataPosition === bitsPerChar - 1) {
                contextDataPosition = 0;
                contextDataString += getCharFromInt(contextDataVal);
                contextDataVal = 0;
              } else {
                contextDataPosition += 1;
              }

              value = 0;
            }

            value = contextW.charCodeAt(0);

            for (i = 16; i--;) {
              contextDataVal = contextDataVal << 1 | value & 1;

              if (contextDataPosition === bitsPerChar - 1) {
                contextDataPosition = 0;
                contextDataString += getCharFromInt(contextDataVal);
                contextDataVal = 0;
              } else {
                contextDataPosition += 1;
              }

              value >>= 1;
            }
          }

          contextEnlargeIn -= 1;

          if (contextEnlargeIn === 0) {
            contextEnlargeIn = Math.pow(2, contextNumBits);
            contextNumBits += 1;
          }

          delete contextDictionaryToCreate[contextW];
        } else {
          value = contextDictionary[contextW];

          for (i = contextNumBits; i--;) {
            contextDataVal = contextDataVal << 1 | value & 1;

            if (contextDataPosition === bitsPerChar - 1) {
              contextDataPosition = 0;
              contextDataString += getCharFromInt(contextDataVal);
              contextDataVal = 0;
            } else {
              contextDataPosition += 1;
            }

            value >>= 1;
          }
        }

        contextEnlargeIn -= 1;

        if (contextEnlargeIn === 0) {
          contextEnlargeIn = Math.pow(2, contextNumBits);
          contextNumBits += 1;
        } // Add wc to the dictionary.


        contextDictionary[contextWc] = contextDictSize;
        contextDictSize += 1;
        contextW = String(contextC);
      }
    } // Output the code for w.


    if (contextW !== '') {
      if (Object.prototype.hasOwnProperty.call(contextDictionaryToCreate, contextW)) {
        if (contextW.charCodeAt(0) < 256) {
          for (i = contextNumBits; i--;) {
            contextDataVal <<= 1;

            if (contextDataPosition === bitsPerChar - 1) {
              contextDataPosition = 0;
              contextDataString += getCharFromInt(contextDataVal);
              contextDataVal = 0;
            } else {
              contextDataPosition += 1;
            }
          }

          value = contextW.charCodeAt(0);

          for (i = 8; i--;) {
            contextDataVal = contextDataVal << 1 | value & 1;

            if (contextDataPosition === bitsPerChar - 1) {
              contextDataPosition = 0;
              contextDataString += getCharFromInt(contextDataVal);
              contextDataVal = 0;
            } else {
              contextDataPosition += 1;
            }

            value >>= 1;
          }
        } else {
          value = 1;

          for (i = contextNumBits; i--;) {
            contextDataVal = contextDataVal << 1 | value;

            if (contextDataPosition === bitsPerChar - 1) {
              contextDataPosition = 0;
              contextDataString += getCharFromInt(contextDataVal);
              contextDataVal = 0;
            } else {
              contextDataPosition += 1;
            }

            value = 0;
          }

          value = contextW.charCodeAt(0);

          for (i = 16; i--;) {
            contextDataVal = contextDataVal << 1 | value & 1;

            if (contextDataPosition === bitsPerChar - 1) {
              contextDataPosition = 0;
              contextDataString += getCharFromInt(contextDataVal);
              contextDataVal = 0;
            } else {
              contextDataPosition += 1;
            }

            value >>= 1;
          }
        }

        contextEnlargeIn -= 1;

        if (contextEnlargeIn === 0) {
          contextEnlargeIn = Math.pow(2, contextNumBits);
          contextNumBits += 1;
        }

        delete contextDictionaryToCreate[contextW];
      } else {
        value = contextDictionary[contextW];

        for (i = contextNumBits; i--;) {
          contextDataVal = contextDataVal << 1 | value & 1;

          if (contextDataPosition === bitsPerChar - 1) {
            contextDataPosition = 0;
            contextDataString += getCharFromInt(contextDataVal);
            contextDataVal = 0;
          } else {
            contextDataPosition += 1;
          }

          value >>= 1;
        }
      }

      contextEnlargeIn -= 1;

      if (contextEnlargeIn === 0) {
        contextEnlargeIn = Math.pow(2, contextNumBits);
        contextNumBits += 1;
      }
    } // Mark the end of the stream


    value = 2;

    for (i = contextNumBits; i--;) {
      contextDataVal = contextDataVal << 1 | value & 1;

      if (contextDataPosition === bitsPerChar - 1) {
        contextDataPosition = 0;
        contextDataString += getCharFromInt(contextDataVal);
        contextDataVal = 0;
      } else {
        contextDataPosition += 1;
      }

      value >>= 1;
    } // Flush the last char


    for (;;) {
      contextDataVal <<= 1;

      if (contextDataPosition === bitsPerChar - 1) {
        contextDataString += getCharFromInt(contextDataVal);
        break;
      } else contextDataPosition += 1;
    }

    return contextDataString;
  }
  /**
   * @param  {number} length
   * @param  {number} resetValue
   * @param  {function(number):string} getNextValue
   * @return {?string}
   */


  function _decompress(length, resetValue, getNextValue) {
    var dictionary = [];
    var enlargeIn = 4;
    var dictSize = 4;
    var numBits = 3;
    var entry = '';
    var result = '';
    var resb;
    var c;
    var data = {
      val: getNextValue(0),
      position: resetValue,
      index: 1
    };

    for (var i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }

    var bits = 0;
    var maxpower = Math.pow(2, 2);
    var power = 1;

    while (power !== maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;

      if (data.position === 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index);
        data.index += 1;
      }

      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }

    switch (bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;

        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;

          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index);
            data.index += 1;
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

        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;

          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index);
            data.index += 1;
          }

          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }

        c = _fcc(bits);
        break;

      case 2:
        return '';

      default:
        break;
    }

    dictionary[3] = c;
    var w = c;
    result = c;

    for (;;) {
      if (data.index > length) {
        return '';
      }

      bits = 0;
      maxpower = Math.pow(2, numBits);
      power = 1;

      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;

        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index);
          data.index += 1;
        }

        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }

      switch (c = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;

          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index);
              data.index += 1;
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize] = _fcc(bits);
          dictSize += 1;
          c = dictSize - 1;
          enlargeIn -= 1;
          break;

        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;

          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;

            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index);
              data.index += 1;
            }

            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }

          dictionary[dictSize] = _fcc(bits);
          dictSize += 1;
          c = dictSize - 1;
          enlargeIn -= 1;
          break;

        case 2:
          return result;

        default:
          break;
      }

      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits += 1;
      }

      if (dictionary[c]) {
        entry = dictionary[c];
      } else if (c === dictSize) {
        entry = w + w[0];
      } else {
        return null;
      }

      result += entry; // Add w+entry[0] to the dictionary.

      dictionary[dictSize] = w + entry[0];
      dictSize += 1;
      enlargeIn -= 1;
      w = entry;

      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits += 1;
      }
    }
  }
})();



/* jslint browser: true*/

/* global Promise:false */

/**
 * The RouterState module.
 */
(function () {
  var stateParamExp = /^{(\w+)}$/;

  oj.RouterState = function (id, options, router) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    oj.Assert.assertString(id); // eslint-disable-next-line no-param-reassign

    id = id.trim(); // The id is in the form /aaa/{p1}/{p2}

    var path = id.split('/'); // We cannot have duplicate because the format of the object parameter
    // doesn't allow it.

    this._id = path.shift();
    this._parameters = {};
    this._paramOrder = new Array(path.length);
    path.forEach(function (pathItem, i) {
      /*
        * Match pattern "{token}"
        */
      var match = pathItem.match(stateParamExp);

      if (match) {
        var token = match[1];
        this._parameters[token] = null;
        this._paramOrder[i] = token;
      }
    }, this);
    this._canEnter = options.canEnter;

    if (this._canEnter) {
      oj.Assert.assertFunctionOrNull(this._canEnter);
    }

    this._enter = options.enter;

    if (this._enter) {
      oj.Assert.assertFunctionOrNull(this._enter);
    }

    this._canExit = options.canExit;

    if (this._canExit) {
      oj.Assert.assertFunctionOrNull(this._canExit);
    }

    this._exit = options.exit;

    if (this._exit) {
      oj.Assert.assertFunctionOrNull(this._exit);
    }

    this._value = options.value;
    this._label = options.label;
    this._title = options.title;
    this._router = router;
    this.viewModel = undefined;
    Object.defineProperties(this, {
      id: {
        value: this._id,
        enumerable: true
      },
      value: {
        get: function get() {
          return this._value;
        },
        set: function set(newValue) {
          this._value = newValue;
        },
        enumerable: true
      },
      label: {
        get: function get() {
          return this._label;
        },
        set: function set(newValue) {
          this._label = newValue;
        },
        enumerable: true
      },
      title: {
        get: function get() {
          return this._title;
        },
        set: function set(newValue) {
          this._title = newValue;
        },
        enumerable: true
      },
      canEnter: {
        get: function get() {
          return this._canEnter;
        },
        set: function set(newValue) {
          this._canEnter = newValue;
        },
        enumerable: true
      },
      enter: {
        get: function get() {
          return this._enter;
        },
        set: function set(newValue) {
          this._enter = newValue;
        },
        enumerable: true
      },
      canExit: {
        get: function get() {
          return this._canExit;
        },
        set: function set(newValue) {
          this._canExit = newValue;
        },
        enumerable: true
      },
      exit: {
        get: function get() {
          return this._exit;
        },
        set: function set(newValue) {
          this._exit = newValue;
        },
        enumerable: true
      },
      parameters: {
        get: function get() {
          return this._parameters;
        },
        enumerable: true
      }
    });
  };

  oj.RouterState.prototype.go = function () {
    if (!this._router) {
      oj.Router._transitionedToState.dispatch({
        hasChanged: false
      });

      return Promise.reject(new Error('Router is not defined for this RouterState object.'));
    }

    return this._router.go(this._id);
  };

  oj.RouterState.prototype.isCurrent = function () {
    if (!this._router) {
      throw new Error('Router is not defined for this RouterState object.');
    }

    return this._router._stateId() === this._id;
  };
})();

  ;return Router; 
});