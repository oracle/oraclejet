/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojobservable', 'ojs/ojurlpathadapter', 'ojs/ojlogger'], function(oj, Observable, UrlPathAdapter, Logger) {
  "use strict";
  var CoreRouter =

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }



/* global Observable, Promise, UrlPathAdapter, Logger, Map */
(function () {
  // Private instances
  var rootRouter;
  var urlAdapter; // noHistorySegments is used by non-tracking routers to store transitions,
  // similar to how history-tracking routers use URL segments

  var noHistorySegments = [];
  /**
   * Test if two routes are equivalent. Routes are equivalent if they have the
   * same paths and parameter values.
   * @param {CoreRouter.Route} route1
   * @param {CoreRouter.Route} route2
   * @return {boolean} true if they're equivalent, false otherwise
   */

  var isEquivalent = function isEquivalent(route1, route2) {
    var route1String = urlAdapter.getUrlForRoutes([route1]);
    var route2String = urlAdapter.getUrlForRoutes([route2]);
    return route1String === route2String;
  };
  /**
   * Build the URL for the currently active routers. This is used by handlePopState
   * to restore the previous URL should a transition be rejected for any reason.
   * This method starts with the root router and builds the routes for all active
   * children, then calls urlAdapter to build the URL.
   * @return {string} The full URL for the current state
   */


  var buildCurrentPath = function buildCurrentPath() {
    var router = rootRouter;
    var routes = [];

    while (router) {
      var cs = router._activeState;
      routes.push(cs);
      router = router._childRouter;
    }

    var url = urlAdapter.getUrlForRoutes(routes);
    return url;
  };
  /**
   * @class CoreRouter
   * @since 8.0.0
   * @ojshortdesc Provides routing functionality with the state of the application being stored in the browser URL
   * @classdesc The router manages application navigation by tracking
   * state through the browser URL. The router's core responsibility is to publish
   * state changes due to navigation so that listeners can react and perform their
   * own logic, such as loading modules.
   * <p>
   * The root router instance is the top-most router, and it has no parent. This
   * instance may be created only once per application, and attempting to create
   * more than one root instance will result in an error.
   * </p>
   *
   * <p>
   * <h5>Create a CoreRouter with a named route and a redirect rule pointing to that route.</h5>
   * The route with the redirect has a blank path value, making it the default
   * route. However, since it redirects to <code>path1</code>, that is the effective
   * default route.
   * <pre class="prettyprint">
   * <code>
   * var root = new CoreRouter([
   *   { path: 'path1' },
   *   { path: '', redirect: 'path1' }
   * ]);
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>With RegExp as path.</h5>
   * Note that all paths matching the regular expression will be using this configuration entry.
   * <pre class="prettyprint">
   * <code>
   * var root = new CoreRouter([
   *   { path: /path-?/ },
   *   { path: '', redirect: 'path-1' }
   * ])
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>With multiple path matches in descending order.</h5>
   * When using RegExp paths, the order of the routes
   * defined is significant. When searching for a matching state, the router will
   * always search top-down to find the first matching state.
   * </p>
   * <p>
   * In the example below, the value "path-1" will match the first route and will
   * be the one used, even though it would've also matched the second route.
   * <pre class="prettyprint">
   * <code>
   * var root = new CoreRouter([
   *   { path: /path-[0-9]/ },
   *   { path: /path-?/ },
   *   { path: new RegExp('.*') }
   * ])
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>A child router</h5>
   * Child router are created with the {@link CoreRouter.createChildRouter} method.
   * All arguments to that function are the same as what would be passed to the
   * constructor for CoreRouter.
   * <pre class="prettyprint">
   * <code>
   * var child = root.createChildRouter(
   *   [    // routes
   *     { path: 'dashboard' }
   *   ]
   * );
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>A child router which doesn't manipulate history</h5>
   * Some routing use cases want to use the Observables of the router without
   * manipulating the browser history, such as navigating through a wizard whose
   * individual steps shouldn't be bookmarked. Here a child router is created and
   * configured to not manipulate history.
   * <pre class="prettyprint">
   * <code>
   * var child = root.createChildRouter(
   *   [
   *     { path: 'dashboard' }
   *   ],
   *   {
   *     history: 'skip'
   *   }
   * )
   * </code>
   * </pre>
   * </p>
   *
   * @param {Array.<CoreRouter.DetailedRouteConfig|CoreRouter.RedirectedRouteConfig>} routes An array of routes that this
   * router will recognize
   * @param {CoreRouter.CreateOptions=} options The configuration options for this
   * router.
   * @param {CoreRouter=} parentRouter A parent router, if creating a child router,
   * or null/undefined if this is the root router.
   * @export
   * @ojtsmodule
   * @ojsignature [{target: "Type",
   *               value: "class CoreRouter<
   *               D extends {[key: string]: any} = {[key: string]: any}, P extends {[key: string]: any} = {[key: string]: any},
   *               ParentD extends {[key: string]: any} = {[key: string]: any}, ParentP extends {[key: string]: any} = {[key: string]: any}>",
   *               genericParameters: [{"name": "D", "description": "Detail object for the router state"},
   *                                   {"name": "P", "description": "Parameters object for the router state"},
   *                                   {"name": "ParentD", "description": "Detail object for the parent router state"},
   *                                   {"name": "ParentP", "description": "Parameters object for the parent router state"}]},
   *               {target: "Type", value: "Array.<CoreRouter.DetailedRouteConfig<D>|CoreRouter.RedirectedRouteConfig>", for: "routes"},
   *               {target: "Type", value: "CoreRouter.CreateOptions<P>", for: "options"},
   *               {target: "Type", value: "CoreRouter<ParentD, ParentP>", for: "parentRouter"}]
   * @constructor
   * @since 8.0.0
   */

  /**
   * An observable which publishes state changes that are about to be set as
   * the current state for the router. Subscribers can choose to listen to
   * these publishes to guard against the router navigating out of the current
   * state.
   * <p>
   * The published value given to the subscriber is a {@link CoreRouter.ResultableData},
   * and it can be used to prevent navigation out of the current state.
   * <pre class="prettyprint">
   * <code>
   * router.beforeStateChange.subscribe(function (args) {
   *   var state = args.state;
   *   var accept = args.accept;
   *   // If we don't want to leave, block navigation
   *   if (currentViewmodel.isDirty) {
   *     accept(Promise.reject('model is dirty'));
   *   }
   * });
   * </code>
   * </pre>
   * The value returned can be a boolean or Promise<boolean>.
   * </p>
   * @name beforeStateChange
   * @memberof CoreRouter
   * @type {CoreRouter.Observable<VetoableState>}
   * @ojsignature {
   *   target: 'Type',
   *   value: 'CoreRouter.Observable<CoreRouter.VetoableState<D, P>>'
   * }
   * @instance
   * @export
   */

  /**
   * An observable which publishes the change to the current router state.
   * Subscribers can listen to these publishes to react to the state change
   * and perform other work, such as loading modules.
   * <p>
   * The published value given to the subscriber is a {@link CoreRouter.ResultableData},
   * and it can be used to report back to the router any issues or asynchronous
   * activity that must be completed before the transition is finalized.
   * <pre class="prettyprint">
   * <code>
   * router.currentState.subscribe(function (args) {
   *   var state = args.state;
   *   var name = state.path;
   *   var complete = args.complete;
   *   // Load the module and return Promise to CoreRouter
   *   complete(
   *     Promise.all([
   *       ModuleUtils.createView({ viewPath: 'views/' + name + '.html' }),
   *       ModuleUtils.createViewModel({ viewModelPath: 'viewModels/' + name })
   *     ])
   *   );
   * });
   * </code>
   * </pre>
   * </p>
   * Subscribers listening to the change to perform asynchronous work, such
   * as loading modules, can return the Promises from those operations through
   * the <code>complete</code> callback. Any errors or Promise rejections returned
   * will cause the transition to fail, and the error will be propagated by
   * the {@link CoreRouter.errors} observable. The returned value must be a
   * Promise.
   * @name currentState
   * @memberof CoreRouter
   * @type {CoreRouter.Observable<ActionableState>}
   * @ojsignature {
   *   target: 'Type',
   *   value: 'CoreRouter.Observable<CoreRouter.ActionableState<D, P>>'
   * }
   * @instance
   * @export
   */


  function CoreRouter(routes, options, parentRouter) {
    // eslint-disable-next-line no-param-reassign
    options = options || {};
    this._name = '/'; // _offset is the distance from the root router

    this._offset = 0;
    this.beforeStateChange = new Observable.BehaviorSubject({
      accept: function accept() {}
    });
    this.currentState = new Observable.BehaviorSubject({
      complete: function complete() {}
    }); // If parent router is history-skipping, so are all of its descendants

    this._noHistory = parentRouter && parentRouter._noHistory || options.history === 'skip'; // Offset from first no-history tracking router

    this._noHistoryOffset = 0;
    this._parentRouter = parentRouter;

    if (!parentRouter) {
      if (rootRouter) {
        throw Error('Only one root CoreRouter instance may exist at a time');
      }

      rootRouter = this; // If a urlAdapter was given use it, otherwise, use UrlPathAdapter

      urlAdapter = options.urlAdapter || new UrlPathAdapter(); // If this is the root router, listen to window 'popstate'

      this._setupNavigationListener();
    } else {
      // Concatenate parent's name and state to make this child router's name
      this._name = parentRouter._name + parentRouter._activeState.path + '/'; // _offset is the relative offset to the root router

      this._offset = parentRouter._offset + 1;

      if (parentRouter._noHistory) {
        // For nested history-skipping routers, track separate offset to be used
        // to find their transitions from noHistorySegments. Note that if parent
        // router is history-skipping, we, too, are history-skipping.
        this._noHistoryOffset = parentRouter._noHistoryOffset + 1;
      }
    }

    this._configure(routes);
  }
  /**
   * Configure any additional states with parameters.
   * @private
   */


  CoreRouter.prototype._configure = function (config) {
    this._states = [];

    if (config) {
      config.forEach(function (entry) {
        var path = entry.path;
        var match = path; // If path is string, match it entirely

        if (typeof path === 'string') {
          match = new RegExp('^' + path + '$');
        } else if (!(path instanceof RegExp)) {
          throw Error('Router path must be a string or RegExp');
        }

        var state = {
          path: path,
          detail: entry.detail,
          params: {},
          _match: match,
          _redirect: entry.redirect
        };

        this._states.push(state);
      }, this);
    }
  };
  /**
   * Synchronize the router with the current URL. This method tells the router
   * that it should set its internal state to match the values in the URL. Each
   * router at each level sychronizes only the parts of the URL in which it's
   * interested.
   * <p>
   * The top-most root router's "base" is defined by the <code>baseUrl</code>
   * option passed to {@link UrlPathAdapter}, if it's used. If using
   * {@link UrlParamAdapter}, the base is document.location.pathname.
   * </p>
   * <p>
   * sync() is normally called immediately after the router is created so that the
   * default state can be made current. Much like {@link CoreRouter.go}, sync() returns
   * a Promise indicating if the synchronization was successful. A failure could
   * mean that the router doesn't have a default state (see examples in {@link CoreRouter})
   * or the state being synchronized is invalid for the current router.
   * </p>
   *
   * <p>
   * Synchronize the default state of a root router. This assumes that the
   * baseUrl is <code>"/"</code> and the user is
   * visiting the root of the application.
   * <pre class="prettyprint">
   * <code>
   * var root = new CoreRouter([
   *   { path: '', redirect: 'home' },
   *   { path: 'home' }
   * ]);
   * root.sync()
   * .catch(function (error) {
   *   console.error('CoreRouter.sync failed "' + error + '"');
   * })
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * Synchronize a child router. This assumes that the parent's current state is
   * <code>browse</code> and the user is visiting <code>browse/department</code>.
   * <pre class="prettyprint">
   * <code>
   * var child = new CoreRouter(
   *   [
   *     { path: 'department' }
   *   ],
   *   null,
   *   parentRouter
   * );
   * child.sync()
   * .then(function (success) {
   *   if (success) {
   *     console.log('Child router synchronized');
   *   }
   * })
   * .catch(function (error) {
   *   console.error('Child router.sync error "' + error + '"');
   * })
   * </code>
   * </pre>
   * </p>
   *
   * @return {Promise<CoreRouter.CoreRouterState>} A Promise which, when resolved,
   * indicates that the sync was successful. A Promise rejection indicates that
   * the sync failed. An error message may be returned describing the reason for
   * the rejection.
   * @name sync
   * @memberof CoreRouter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Promise<CoreRouter.CoreRouterState<D, P>>", for: "returns"}
   */


  CoreRouter.prototype.sync = function () {
    var route = this._getRouteSegment(); // Transition to the new route, or a default one if no current one exists


    return this._execute(route || {
      path: '',
      params: {}
    }).then(function (state) {
      // Synchronize the next child router
      var p = state;
      var childRouter = this._childRouter;

      if (childRouter) {
        p = childRouter.sync();
      } else if (!this._noHistory) {
        // Cleanup noHistorySegments after navigating any history-tracking routers
        noHistorySegments = [];
      }

      return p;
    }.bind(this));
  };
  /**
   * Get the route segment for this individual router.
   * @return {CoreRouter.Route}
   * @private
   */


  CoreRouter.prototype._getRouteSegment = function () {
    var route;

    if (this._noHistory) {
      route = noHistorySegments[this._noHistoryOffset];
    } else {
      var routes = urlAdapter.getRoutesForUrl();
      route = routes[this._offset];
    }

    return route;
  };
  /**
   * Navigate the router to a new path.
   * Each argument to this function should be of
   * type {@link CoreRouter.Route}.
   *
   * <p>
   * <h5>Navigate to a page</h5>
   * Navigate to a page simply by supplying the path matching the route as an array
   * of strings. This method, like {@link CoreRouter.sync} returns a Promise<boolean>
   * to indicate if the transition was successful. You can chain the Promise to
   * do post-processing if you choose.
   * <pre class="prettyprint">
   * <code>
   * router.go({path: 'dashboard'})
   * .then(function () {
   *   this.navigated = true;
   * })
   * // URL "/dashboard"
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>Navigate passing dynamic state parameters</h5>
   * Paths are any string within the array to go(), and parameters are any objects
   * in the array. Parameters are always associated with the <i>previous</i> path
   * segment (in this case, "dashboard"), and must have scalar values.
   * <br/>
   * These parameters
   * are made available via the {@link CoreRouterState.params} object.
   * <pre class="prettyprint">
   * <code>
   * router.go({path: 'dashboard', params: {name: 'Dashboard'}})
   * // URL "/dashboard;name=Dashboard"
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>Navigate to a nested path</h5>
   * Nested paths are simply another string in the array passed to go(). When an
   * entry in the array is a complex object, it's associated with the previous
   * path entry.
   * <br/>
   * In this example, formatted for clarity, "employee" is the path which will
   * receive the parameters object containing "id" value.
   * <pre class="prettyprint">
   * <code>
   * router.go(
   *   {path: 'employee', params: {id: 456}},
   *   {path: 'contacts'}
   * ])
   * // URL "/employee;id=456/contacts"
   * </code>
   * </pre>
   * </p>
   *
   * <p>
   * <h5>Catching navigation errors</h5>
   * Errors encountered during navigation are returned as Promise rejections, and
   * can be caught with the catch() method.
   * <br/>
   * The types of errors that can occur are:
   * <ul>
   *   <li>No matching state
   *   <li>State change veto'd
   *   <li>Downstream state change listener errors
   * </ul>
   * <pre class="prettyprint">
   * <code>
   * router.go({path: 'home'})
   * .catch(function (error) {
   *   console.error('Routing problem "' + error + '"');
   * });
   * </code>
   * </pre>
   * </p>
   *
   * @param {...CoreRouter.Route} route The route(s) to navigate. Pass multiple routes
   * as separate arguments.
   * @return {Promise.<CoreRouter.CoreRouterState>} A Promise which will resolve
   * with the state to which the router transitioned, if successful. If the transition
   * fails, the Promise will be rejected.
   * @name go
   * @memberof CoreRouter
   * @method
   * @instance
   * @export
   * @ojsignature [{target: "Type", value: "CoreRouter.Route<P>[]", for: "route"},
   *               {target: "Type", value: "Promise<CoreRouter.CoreRouterState<D, P>>", for: "returns"}]
   */


  CoreRouter.prototype.go = function () {
    var trans = Array.prototype.slice.call(arguments, 0);
    var goP;
    trans.forEach(function (transition) {
      var params = transition.params;

      if (params) {
        // Only scalar values in params object
        Object.keys(params).forEach(function (key) {
          if (_typeof(params[key]) === 'object') {
            goP = Promise.reject('"params" object may only contain scalar values');
          }
        });
      }
    });

    if (!goP) {
      var path = trans.map(function (t) {
        return t.path;
      }).join('/');

      if (this._noHistory) {
        Logger.info("Navigating non-history tracking router(".concat(this._name, ") to ").concat(path)); // Non-history tracking routers use noHistorySegments in place of URL
        // to store their transitions. Replace the segments after our index with
        // the new transitions

        noHistorySegments = noHistorySegments.slice(0, this._noHistoryOffset).concat(trans);
      } else {
        Logger.info("Navigating router(".concat(this._name, ") to ").concat(path)); // Get all current routes from the URL and replace the ones after our
        // index with the new transition

        var routes = urlAdapter.getRoutesForUrl();
        routes = routes.slice(0, this._offset).concat(trans);
        var fullPath = urlAdapter.getUrlForRoutes(routes);
        window.history.pushState(null, 'path', fullPath);
      }

      goP = this.sync();
    }

    return goP;
  };
  /**
   * Perform the navigation to a new path, described by the Route object.
   * @param {CoreRouter.Route} route The new route to navigate to
   * @return {Promise<CoreRouter.CoreRouterState>}
   * @private
   */


  CoreRouter.prototype._execute = function (route) {
    var state = this._getPendingState(route);

    var execPromise;

    if (!state) {
      execPromise = Promise.reject('Router(' + this._name + ') has no state matching "' + route.path + '"');
    } else {
      execPromise = this._prepublish(state);

      if (!this._isCurrentState(state)) {
        execPromise = execPromise.then(function () {
          var pubPromise = Promise.resolve(false);
          pubPromise = this._publish(state);
          return pubPromise;
        }.bind(this));
      }
    }

    return execPromise;
  };
  /**
   * Invoked before a new state change is about to occur, allowing
   * subscribers a chance to block the transition by returning a Promise rejection.
   * @param {CoreRouterState} state The new state to where we want to transition.
   * @return {Promise<CoreRouterState>} A Promise which resolves to the pre-published
   * state, or rejection if a listener rejects the transition.
   * @private
   */


  CoreRouter.prototype._prepublish = function (state) {
    var allPre = [];
    this.beforeStateChange.next({
      state: state,
      accept: function accept(res) {
        allPre.push(res);
      }
    });
    var activeSync = Promise.all(allPre).then(function () {
      return state;
    }); // If child router, append its pre-publish results

    var child = this._childRouter;

    if (child) {
      activeSync = activeSync.then(function () {
        return child._prepublish(state);
      });
    }

    activeSync = activeSync.then(function (s) {
      if (activeSync !== this._activeSync) {
        // If this isn't the latest sync, then reject the Promise because another
        // sync() is already underway
        return Promise.reject();
      }

      return s;
    }.bind(this), function reject(msg) {
      if (activeSync === this._activeSync) {
        // If rejection occurs during sync and we're the active (most recent)
        // sync(), then restore the URL according to the current routers.
        Logger.info('Router sync failed: ' + msg);
        var url = buildCurrentPath();
        window.history.replaceState(null, 'path', url);
      }

      return Promise.reject(msg);
    }.bind(this));
    this._activeSync = activeSync;
    return activeSync;
  };
  /**
   * Publish the new router state to all subscribers.
   * If all listeners respond with true/Promise<true>, then the currentState
   * is published with the new state.
   * @param {RouterState} state The transition state
   * @private
   */


  CoreRouter.prototype._publish = function (state) {
    var allPub = [];
    this._childRouter = null; // Save to "_activeState" and publish to subscribers

    this._activeState = state;
    this.currentState.next({
      state: state,
      complete: function complete(res) {
        allPub.push(res);
      }
    });
    return Promise.all(allPub).then(function () {
      return state;
    });
  };

  CoreRouter.prototype._setupNavigationListener = function () {
    if (this === rootRouter) {
      this._popstateHandler = this.sync.bind(this);
      window.addEventListener('popstate', this._popstateHandler, false);
    }
  };
  /**
   * Compare the given state with the current state, and test if they are
   * equivalent. States will be equivalent if their path and parameter values
   * are equivalent.
   */


  CoreRouter.prototype._isCurrentState = function (state) {
    var cs = this._activeState;

    if (!cs) {
      // If no current state, then the new state is not current
      return false;
    }

    return isEquivalent(cs, state);
  };
  /**
   * Create a CoreRouterState for the given transition which matches one of the pre-
   * configured states. This CoreRouterState object will similar to the matched configured
   * state, except will have its own path and params values.
   * @param {CoreRouter.Route} transition The transition for the CoreRouterState
   * @return {CoreRouter.RouterState} The CoreRouterState associated for the transition
   */


  CoreRouter.prototype._getPendingState = function (transition) {
    var match;
    var pending;
    var path = transition.path;
    var params = transition.params || {};

    this._states.some(function (state) {
      if (state._match.test(path)) {
        match = state;
        return true;
      }

      return false;
    });

    if (match && match._redirect) {
      path = match._redirect;
      match = this._getPendingState({
        path: path,
        params: params
      });
    }

    if (match) {
      pending = {
        path: path,
        detail: match.detail,
        params: params,
        _match: match._match,
        _redirect: match._redirect
      };
      Object.freeze(pending);
    }

    return pending;
  };
  /**
   * Create a child router from the current router. The child will be associated
   * with the parent router's state, therefore, the parent must be in a current
   * state (by calling {@link CoreRouter.go} or {@link CoreRouter.sync}). Calling
   * this method from a parent without a current state, or calling the method twice
   * for the same state will result in an error.
   * <p>
   * Only one child router will be active per parent router, and only in the
   * parent router's current state. When the parent router changes states, and
   * the previous state had a child router, it will be disposed of. This means
   * that child routers should always be recreated each time the state is activated.
   * This is typically done in the viewmodel's constructor/initialize functions.
   * </p>
   * <pre class="prettyprint">
   * <code>
   * this.initialize = function (args) {
   *   this.childRouter = args.parentRouter.createChildRouter([
   *     { path: 'child-path' }
   *   ]);
   * }.bind(this);
   * </code>
   * </pre>
   * @param {Array.<CoreRouter.DetailedRouteConfig|CoreRouter.RedirectedRouteConfig>} routes The routes to configure for the child router.
   * @param {CoreRouter.CreateOptions=} options Options to pass to the creation of the router. Currently,
   * the support options are:
   * <ul>
   *   <li> history: "skip"
   * </ul>
   * Note that if the current router doesn't update history (history='skip'), then
   * no descendant routers will update history either, regardless of whether
   * the flag is specified.
   * @return {CoreRouter} The child router instance for the current state
   * @see CoreRouter.createRouter
   * @name createChildRouter
   * @memberof CoreRouter
   * @method
   * @instance
   * @export
   * @ojsignature [{target:"Type", value:"<ChildD extends {[key: string]: any} = {[key: string]: any}, ChildP extends {[key: string]: any} = {[key: string]: any}>",
   *               for:"genericTypeParameters",
   *               genericParameters: [{"name": "ChildD", "description": "Detail object for the child router state"},
   *                                   {"name": "ChildP", "description": "Parameters object for the child router state"}]},
   *               {target: "Type", value: "Array.<CoreRouter.DetailedRouteConfig<ChildD>|CoreRouter.RedirectedRouteConfig>", for: "routes"},
   *               {target: "Type", value: "CoreRouter.CreateOptions<ChildP>", for: "options"},
   *               {target: "Type", value: "CoreRouter<ChildD, ChildP>", for: "returns"}]
   */


  CoreRouter.prototype.createChildRouter = function (routes, options) {
    var cs = this._activeState;

    if (!cs) {
      throw Error('Router(' + this._name + ') has no current state. ' + 'Call sync() on the router first.');
    }

    if (this._childRouter) {
      throw Error('Router(' + this._name + ') state(' + cs.path + ') already has a child router');
    }

    var childRouter = new CoreRouter(routes, options, this); // Set the current state's childRouter

    this._childRouter = childRouter;
    return childRouter;
  };
  /**
   * Destroys the router instance and removes the browser navigation listener
   * (Back/Forward).
   * Note that this function only applies to the root router instance;
   * calling it on child routers will have no effect.
   * @name destroy
   * @memberof CoreRouter
   * @method
   * @instance
   * @export
   */


  CoreRouter.prototype.destroy = function () {
    if (this === rootRouter) {
      window.removeEventListener('popstate', this._popstateHandler, false);
      rootRouter = null;
    }
  };

  return CoreRouter;
})();
/**
 * An object describing configuration options during the creation of a root
 * CoreRouter instance.
 * @typedef {object} CoreRouter.CreateOptions
 * @property {'skip'=} history Indicate if history tracking should be skipped. By
 * default, the router will add a new history entry each time {@link CoreRouter.go}
 * is called. Setting this option to 'skip' will disable that.
 * @property {CoreRouter.UrlAdapter=} urlAdapter The adapter which handles reading
 * and writing router states from/to the browser URL. If not specified, this will
 * default to {@link UrlPathAdapter}.
 * @ojsignature [{target: "Type", value: "UrlAdapter<P>", for: "urlAdapter"},
 *               {target: "Type", value: "<P = {[key: string]: any}>", for: "genericTypeParameters"}]
 */

/**
 * A route config object configures a path and associated information to which a
 * router can navigate, and is used to build the {@link CoreRouter.CoreRouterState}
 * during transitions. This route config type can specify a detail object which
 * can be referenced in the state.
 * @typedef {object} CoreRouter.DetailedRouteConfig
 * @property {string|RegExp} path The path of the route. This may be an exact-
 * match string, or a regular expression.
 * @property {object=} detail An optional detail object which is passed to
 * the route when it is navigated to.
 * @ojsignature [{target: "Type", value: "D", for: "detail"},
 *               {target: "Type", value: "<D = {[key: string]: any}>", for: "genericTypeParameters"}]
 */

/**
 * A RouteConfig object configures a path and associated information to which a
 * router can navigate, and is used to build the {@link CoreRouter.CoreRouterState}
 * during transitions. This route config type can specify a redirect to another
 * route.
 * @typedef {object} CoreRouter.RedirectedRouteConfig
 * @property {string|RegExp} path The path of the route. This may be an exact-
 * match string, or a regular expression.
 * @property {string=} redirect An optional name of a route to which paths matching
 * this route will redirect. The redirected route's path must be of type string.
 */

/**
 * A Route defines the path and optional parameters to which a router will navigate.
 * The Route.path must match a route config which was passed
 * to the router via the {@link CoreRouter} constructor or {@link CoreRouter.createChildRouter}.
 * @interface CoreRouter.Route
 * @ojsignature [{
 *                target: "Type",
 *                value: "interface Route<P extends {[key: string]: any} = {[key: string]: any}>",
 *                genericParameters: [{"name": "P", "description": "Parameters object for the router state"}]
 *               }]
 */

/**
 * The path of the route
 * @name path
 * @type {string}
 * @memberof CoreRouter.Route
 * @instance
 */

/**
 * The path of the route
 * @name params
 * @type {object=}
 * @memberof CoreRouter.Route
 * @instance
 * @ojsignature { target: 'Type', value: 'P' }
 */

/**
 * A URL adapter manages reading/writing router states from/to the browser URL.
 * @typedef {object} CoreRouter.UrlAdapter
 * @property {function(Array.<CoreRouter.Route>): string} getUrlForRoutes Get
 * the full URL for the given routes.
 * @property {function(): Array.<CoreRouter.Route>} getRoutesForUrl Given the
 * current browser URL, get all of the routes, starting from the root, down to
 * the last child.
 * @ojsignature [{target: 'Type', value: '((routes: Route<P>[]) => string)', for: "getUrlForRoutes"},
 *               {target: 'Type', value: '(() => Route<P>[])', for: "getRoutesForUrl"},
 *               {target: "Type", value: "<P = {[key: string]: any}>", for: "genericTypeParameters"}]
 */

/**
 * An Observable which can receive subscriptions for new Observers
 * @typedef {object} CoreRouter.Observable<T>
 * @property {function(function(T): void): CoreRouter.Observer} subscribe Subscribe to the observable to get
 * notifications when the value changse. The subscriber callback will receive the
 * value as its single argument. Calling subscribe will return the subscriber
 * object, which can be used to unsubscribe from the observable.
 */

/**
 * An Observer is the result of subscribing to an Observable, and can be used to
 * unsubscribe.
 * @typedef {object} CoreRouter.Observer
 * @property {function(): void} unsubscribe Unsubscribe the observable from further
 * modifications to the value.
  */

/**
 * A wrapper object which contains a state and a <code>complete</code> callback
 * that can be used by the subscriber to return a Promise for its asynchronous
 * operations.
 * @typedef {object} CoreRouter.ActionableState
 * @property {CoreRouterState} state The CoreRouterState object
 * @property {function(Promise<any>): null} complete The callback function the subscriber
 * can use to return a Promise for its asynchronous activities. Invoking this
 * callback is optional, but allows for the subscriber to delay the completion
 * of the router state transition until its own asynchronous activities are done.
 * @ojsignature [{target: "Type", value: "CoreRouterState<D, P>", for: "state"},
 *               {target: "Type", value: "<D = {[key: string]: any}, P = {[key: string]: any}>", for: "genericTypeParameters"}]
 */

/**
 * A wrapper object which contains a state and an <code>accept</code> callback
 * that can be used by the subscriber to return a Promise for its acceptance
 * or rejection of the state transition.
 * @typedef {object} CoreRouter.VetoableState
 * @property {CoreRouterState} state The CoreRouterState object
 * @property {function(Promise<any>): null} accept The callback function the
 * subscriber can use to return a Promise<boolean> indicating whether the state
 * transition ought to be accepted (true) or rejected (false). A Promise rejection
 * will veto the state transition; any Promise resolution (or not invoking the
 * callback at all) will accept the transition.
 * @ojsignature [{target: "Type", value: "CoreRouterState<D, P>", for: "state"},
 *               {target: "Type", value: "<D = {[key: string]: any}, P = {[key: string]: any}>", for: "genericTypeParameters"}]
 */



/**
 * An interface describing the object used by {@link CoreRouter} to represent
 * the routes and associated information to which it can navigate.
 * @interface CoreRouterState
 * @ojtsnamespace CoreRouter
 * @ojsignature [{
 *                target: "Type",
 *                value: "interface CoreRouterState<D extends {[key: string]: any} = {[key: string]: any}, P extends {[key: string]: any} = {[key: string]: any}>",
 *                genericParameters: [{"name": "D", "description": "Detail object for the router state"},
 *                                    {"name": "P", "description": "Parameters object for the router state"}]
 *               }
 *              ]
 */

/**
 * The path of the state. This will always be the string used to navigate
 * to the current state, even if the original path for the route was defined
 * as a RegExp.
 * @name path
 * @memberof CoreRouterState
 * @instance
 * @type {string}
 * @readonly
 */

/**
 * The detail object for the state, if configured.
 * @name detail
 * @memberof CoreRouterState
 * @type {Object}
 * @instance
 * @readonly
 * @ojsignature { target: 'Type', value: 'D'}
 */

/**
 * Parameters for the state. Parameters are passed to the state via the
 * {@link CoreRouter.go} method.
 * @name params
 * @memberof CoreRouterState
 * @type {Object}
 * @instance
 * @readonly
 * @ojsignature { target: 'Type', value: 'P'}
 */

  return CoreRouter;
});
