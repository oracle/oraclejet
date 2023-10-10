/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { BehaviorSubject } from 'ojs/ojobservable';
import UrlPathAdapter from 'ojs/ojurlpathadapter';
import { info } from 'ojs/ojlogger';

/**
 * An interface describing the object used by {@link CoreRouter} to represent
 * the routes and associated information to which it can navigate.
 * @interface CoreRouterState
 * @ojtsnamespace CoreRouter
 * @ojtsimport knockout
 * @ojsignature [{
 *                target: "Type",
 *                value: "interface CoreRouterState<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>",
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
 * {@link CoreRouter#go} method.
 * @name params
 * @memberof CoreRouterState
 * @type {Object}
 * @instance
 * @readonly
 * @ojsignature { target: 'Type', value: 'P'}
 */
/**
 * Path parameter names for the state, ordered in the order in which they were
 * defined in the route. The names do not include the braces.
 * @name pathParams
 * @memberof CoreRouterState
 * @type {string[]}
 * @instance
 * @readonly
 * @ojsignature { target: 'Type', value: 'string[]'}
 */
/**
 * A redirect path, if configured. This is taken from the original route configuration,
 * and may be undefined.
 * @name redirect
 * @memberof CoreRouterState
 * @type {string=}
 * @instance
 * @readonly
 */

// Private instances
let rootRouter;
let urlAdapter;
// noHistorySegments is used by non-tracking routers to store transitions,
// similar to how history-tracking routers use URL segments
let noHistorySegments = [];

// Pending transitions array to hold extra transitions passed to go()
let pendingTransitions = [];

/**
 * Test if two routes are equivalent. Routes are equivalent if they have the
 * same paths and parameter values.
 * @param {CoreRouter.Route} route1
 * @param {CoreRouter.Route} route2
 * @return {boolean} true if they're equivalent, false otherwise
 * @ignore
 */
var isEquivalent = function (route1, route2) {
  var route1String = urlAdapter.getUrlForRoutes([route1]);
  var route2String = urlAdapter.getUrlForRoutes([route2]);
  return route1String === route2String;
};

/**
 * Get an array of active routes, starting from the root router down to the
 * last child.
 * @return {Array.<CoreRouter.Route>} An array of all active routes, with the
 * root route as the first element.
 * @ignore
 */
var getActiveRoutes = function () {
  let router = rootRouter;
  const routes = [];
  while (router) {
    let state = router._activeState;
    if (state) {
      routes.push({
        path: state.path || '',
        params: state.params,
        pathParams: state.pathParams
      });
    } else {
      state = router._getPendingState({ path: '' });
      if (state) {
        routes.push(state);
      }
      break;
    }
    router = router.childRouter;
  }
  return routes;
};

const paramRegex = /^{(\w+)}$/;
/**
 * Get the name of the path parameter
 * @param {*} segment The path segment to parse
 * @ignore
 */
function getPathParam(segment) {
  const match = segment.match(paramRegex);
  if (match) {
    return match[1];
  }
  throw Error(`no path parameter found for segment ${segment}`);
}

/**
 * An observable which publishes state changes that are about to be set as
 * the current state for the router. Subscribers can choose to listen to
 * these publishes to guard against the router navigating out of the current
 * state.
 * <p>
 * The published value given to the subscriber is a {@link CoreRouter.VetoableState},
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
 * @ojsignature [{target: 'Type', value: 'CoreRouter.Observable<CoreRouter.VetoableState<D, P>>'},
 *               {target: 'Type', value: '<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>', for: 'genericTypeParameters'}]
 * @instance
 * @export
 */

/**
 * An observable which publishes the change to the current router state.
 * Subscribers can listen to these publishes to react to the state change
 * and perform other work, such as loading modules.
 * <p>
 * The published value given to the subscriber is a {@link CoreRouter.ActionableState},
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
 * will cause the transition to fail, and the rejection will be returned to the
 * caller that attempted the transition.
 * The returned value must be a Promise.
 * @name currentState
 * @memberof CoreRouter
 * @type {CoreRouter.Observable<ActionableState>}
 * @ojsignature [{target: 'Type', value: 'CoreRouter.Observable<CoreRouter.ActionableState<D, P>>'},
 *               {target: 'Type', value: '<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>', for: 'genericTypeParameters'}]
 * @instance
 * @export
 */

/**
 * The current child router for this router's active state, if one exists.
 * Child routers can be created with {@link CoreRouter#createChildRouter}.
 * @name childRouter
 * @memberof CoreRouter
 * @type {CoreRouter}
 * @instance
 * @export
 */

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
 * Child router are created with the {@link CoreRouter#createChildRouter} method.
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
 * <p>
 * <h5>A path with parameters</h5>
 * Path definitions can contain parameter names as placeholders if using
 * {@link UrlPathParamAdapter}.
 * <pre class="prettyprint">
 * <code>
 * var root = new CoreRouter([
 *   { path: 'orders/{id}/{mode}' }
 * ]);
 * </code>
 * </pre>
 * Each parameter must be predefined for the route, and when navigating, they
 * must all be passed in the "params" object to {@link CoreRouter#go}.
 * If the required parameters aren't all passed, the behavior of the router will
 * be unpredictable.
 * </p>
 * <p>
 * Note that using path parameters does not change the way in which parameters
 * are <i>passed</i> to the route--parameters must still be passed in the "params"
 * object to {@link CoreRouter#go}.
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
 *               D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>,
 *               ParentD extends Record<string, any> = Record<string, any>, ParentP extends Record<string, any> = Record<string, any>>",
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
function CoreRouter(routes, options, parentRouter) {
  // eslint-disable-next-line no-param-reassign
  options = options || {};

  this._name = '/';

  this._urlOffset = 0;

  this.beforeStateChange = new BehaviorSubject({ accept: function () {} });

  this.currentState = new BehaviorSubject({ complete: function () {} });

  this._noHistory = options.history === 'skip';
  // Offset from first no-history tracking router
  this._noHistoryOffset = 0;

  this._parentRouter = parentRouter;
  if (!parentRouter) {
    if (rootRouter) {
      throw Error('Only one root CoreRouter instance may exist at a time');
    }
    rootRouter = this;

    // If a urlAdapter was given use it, otherwise, use UrlPathAdapter
    urlAdapter = options.urlAdapter || new UrlPathAdapter();

    // If this is the root router, listen to window 'popstate'
    this._setupNavigationListener();
  } else {
    // Concatenate parent's name and state to make this child router's name
    this._name = parentRouter._name + parentRouter._activeState.path + '/';

    // Child's _urlOffset parent's offset plus any path params
    this._urlOffset = parentRouter._urlOffset + parentRouter._activeState.pathParams.length + 1;

    if (parentRouter._noHistory) {
      // For nested history-skipping routers, track separate offset to be used
      // to find their transitions from noHistorySegments. Note that if parent
      // router is history-skipping, we, too, are history-skipping.
      this._noHistoryOffset =
        parentRouter._noHistoryOffset + parentRouter._activeState.pathParams.length + 1;
    }
  }

  this.childRouter = undefined;

  this._configure(routes);
}

/**
 * Reconfigure the router with new routes. This method will first check that
 * the current state can be exited by pre-publishing the new state to
 * {@link CoreRouter#beforeStateChange}. If no listeners veto the navigation,
 * then the router will reconfigure the routes and navigate to the new route.
 * If any listener rejects the navigation, the rejection will be returned to
 * the caller and the routes will remain as-is.
 * @param {Array.<CoreRouter.DetailedRouteConfig|CoreRouter.RedirectedRouteConfig>} routeConfigs
 * The new route configurations to apply.
 * @param {CoreRouter.Route[]} navigateTo? The new routes to where the router (and its
 * child routers) will navigate after reconfigure.
 * If no routes are given, the current ones will be used. If the routes cannot be
 * navigated to (i.e., they don't exist), the returned Promise will be rejected,
 * the previous route configuration restored, and the router states will remain
 * unchanged.
 * @return {Promise<CoreRouter.CoreRouterState>} A Promise which, when resolved,
 * indicates that the reconfiguration and navigation were successful. A Promise
 * rejection indicates that the reconfigure and navigation failed, and the
 * previous configuration will be restored. Depending on the failure, an error
 * message may be returned describing the reason for the rejection.
 * @name reconfigure
 * @memberof CoreRouter
 * @method
 * @instance
 * @export
 * @ojsignature [
 *   {target: "Type", value: "CoreRouter.Route<P>|CoreRouter.Route<P>[]", for: "navigateTo?"},
 *   {target: "Type", value: "Promise<CoreRouter.CoreRouterState<D, P>>", for: "returns"}
 * ]
 */
CoreRouter.prototype.reconfigure = function (routeConfigs, navigateTo) {
  const oldRoutes = this._routes;

  let newRoutes = navigateTo || this._getActiveRoutes();
  if (newRoutes && !Array.isArray(newRoutes)) {
    // If single route, coerce to array
    newRoutes = [newRoutes];
  }
  this._configure(routeConfigs);
  return this.go(...newRoutes).catch((ex) => {
    this._configure(oldRoutes);
    throw ex;
  });
};

/**
 * Configure any additional states with parameters.
 * @param {CoreRouter.DetailedRouteConfig[] | CoreRouter.RedirectedRouteConfig[]}
 * @private
 */
CoreRouter.prototype._configure = function (routes = []) {
  this._routes = routes.map(function (config) {
    let path = config.path;
    // Parse path params
    let pathParams = [];
    if (typeof path === 'string') {
      const segments = path.split('/');
      path = segments.shift();
      pathParams = segments.map(getPathParam);
    }
    const configuredRoute = {
      path,
      detail: config.detail || {},
      pathParams,
      redirect: config.redirect
    };
    let match = path;
    // If path is string, match it entirely
    if (typeof path === 'string') {
      match = new RegExp('^' + path + '$');
    } else if (!(path instanceof RegExp)) {
      throw Error('Router path must be a string or RegExp');
    }
    configuredRoute._match = match;
    Object.freeze(configuredRoute);
    return configuredRoute;
  }, this);
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
 * default state can be made current. Much like {@link CoreRouter#go}, sync() returns
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
  let route;
  if (pendingTransitions.length) {
    // Use the pending transition as the new state to sync
    const transition = pendingTransitions.shift();
    const newRoutes = this._getParentRoutes().concat(this._getPendingState(transition));
    const newPath = urlAdapter.getUrlForRoutes(newRoutes);
    window.history.replaceState(null, 'path', newPath);
    route = transition;
  } else {
    route = this._getRouteSegment();
  }
  // Transition to the new route, or a default one if no current one exists
  return this._execute(route || { path: '', params: {} }).then((state) => {
    // Synchronize the next child router
    var p = state;
    var childRouter = this.childRouter;
    if (childRouter) {
      p = childRouter.sync();
    } else if (!this._noHistory) {
      // Cleanup noHistorySegments after navigating any history-tracking routers
      noHistorySegments = [];
    }
    return p;
  });
};

/**
 * Get the route segment for this individual router.
 * @return {CoreRouter.Route}
 * @private
 */
CoreRouter.prototype._getRouteSegment = function () {
  let route;
  if (this._noHistory) {
    route = noHistorySegments[this._noHistoryOffset];
  } else {
    // Get the URL segment for this router
    let routes = urlAdapter.getRoutesForUrl();
    route = routes[this._urlOffset];
    // Get route path parameters and call getRoutesForUrl with it
    const pathParams = this._getRoutePathParams(route && route.path);
    routes = urlAdapter.getRoutesForUrl({ offset: this._urlOffset, pathParams });
    route = routes[this._urlOffset];
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
 * of strings. This method, like {@link CoreRouter#sync} returns a Promise<boolean>
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
 * are made available via the {@link CoreRouterState#params} object.
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
CoreRouter.prototype.go = function (...transitions) {
  let goP;

  transitions.forEach(function (transition) {
    var params = transition.params;
    if (params) {
      // Only scalar values in params object
      Object.keys(params).forEach(function (key) {
        if (typeof params[key] === 'object') {
          goP = Promise.reject('"params" object may only contain scalar values');
        }
      });
    }
  });
  if (!goP) {
    const path = transitions.map((t) => t.path).join('/');
    info(`Navigating router(${this._name}) to ${path}`);

    // Use first transition and store remaining for next child router to read
    const first = transitions[0];

    // Get the current routes for all active routers, and compare that to the
    // new routes for this transition.
    const currentPath = urlAdapter.getUrlForRoutes(getActiveRoutes());
    // Insert the new transitions after the current router's route offset
    const newRoutes = this._getParentRoutes().concat(this._getPendingState(first, true));
    const newPath = urlAdapter.getUrlForRoutes(newRoutes);

    const prevNoHistorySegments = noHistorySegments;
    if (this._noHistory) {
      info(`Navigating non-history tracking router(${this._name}) to ${path}`);
      // Non-history tracking routers use noHistorySegments in place of URL
      // to store their transitions. Replace the segments after our index with
      // the new transitions
      noHistorySegments = noHistorySegments.slice(0, this._noHistoryOffset).concat(transitions);
    } else if (currentPath !== newPath) {
      window.history.pushState(null, 'path', newPath);
    }
    goP = this.sync().catch((ex) => {
      // Rollback transitions if navigation rejected
      pendingTransitions = [];
      if (this._noHistory) {
        noHistorySegments = prevNoHistorySegments;
      } else {
        window.history.replaceState(null, 'path', currentPath);
      }
      throw ex;
    });
    pendingTransitions = transitions.slice(1);
  }
  return goP;
};

/**
 * Perform the navigation to a new path, described by the Route object.
 * @param {CoreRouter.CoreRouterState} transition The new state to navigate to
 * @return {Promise<CoreRouter.CoreRouterState>}
 * @private
 */
CoreRouter.prototype._execute = function (transition) {
  const state = this._getPendingState(transition);
  let execPromise;

  if (!state) {
    execPromise = Promise.reject(
      `Router(${this._name}) has no state matching "${transition.path}"`
    );
  } else {
    execPromise = this._prepublish(state);
    if (!this._isCurrentState(state)) {
      execPromise = execPromise.then(() => this._publish(state));
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
  let allPre = [];
  this.beforeStateChange.next({
    state,
    accept: function (res) {
      allPre.push(res);
    }
  });
  let activeSync = Promise.all(allPre).then(() => state);
  if (this.childRouter) {
    activeSync = activeSync.then(() => this.childRouter._prepublish(state));
  }

  activeSync = activeSync.then((s) => {
    if (activeSync !== this._activeSync) {
      // If this isn't the latest sync, then reject the Promise because another
      // sync() is already underway
      return Promise.reject();
    }
    return s;
  });
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
  this.childRouter = null;
  // Save to "_activeState" and publish to subscribers
  this._activeState = state;
  this.currentState.next({
    state,
    complete: function (res) {
      allPub.push(res);
    }
  });
  return Promise.all(allPub).then(() => state);
};

/**
 * @private
 */
CoreRouter.prototype._setupNavigationListener = function () {
  if (this === rootRouter) {
    this._popstateHandler = () => {
      pendingTransitions = [];
      this.sync();
    };
    window.addEventListener('popstate', this._popstateHandler, false);
  }
};

/**
 * Compare the given state with the current state, and test if they are
 * equivalent. States will be equivalent if their path and parameter values
 * are equivalent.
 * @private
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
 * @param {boolean} createEmpty Create an empty state object for the transition,
 * even if a matching route doesn't exist.
 * @return {CoreRouter.RouterState} The CoreRouterState associated for the transition
 * @private
 */
CoreRouter.prototype._getPendingState = function (transition, createEmpty) {
  var pending;
  var path = transition.path;
  var params = transition.params || {};
  let match = this._routes.find((route) => route._match.test(path));
  if (match && match.redirect) {
    path = match.redirect;
    match = this._getPendingState({ path: path, params: params });
  }
  if (match) {
    pending = {
      path,
      params,
      detail: match.detail,
      pathParams: match.pathParams,
      redirect: match.redirect,
      _match: match._match
    };
    Object.freeze(pending);
  } else if (createEmpty) {
    pending = {
      path,
      params: {},
      detail: {},
      pathParams: []
    };
  }
  return pending;
};

/**
 * Get the pathParams array for the given path
 * @private
 * @ignore
 * @param {string} path The path value of the route
 * @return string[] The array of path parameters for the route
 */
CoreRouter.prototype._getRoutePathParams = function (path = '') {
  const state = this._getPendingState({ path: path });
  return state ? state.pathParams : [];
};

/**
 * @private
 * @ignore
 * Gets the active routes for all antecedent routes, from the root down to, but
 * excluding, this router.
 * @returns An array of the active parent routes
 */
CoreRouter.prototype._getParentRoutes = function () {
  return getActiveRoutes().slice(0, this._urlOffset);
};
/**
 * @private
 * @ignore
 * Gets the active routes for this router. Active routes are all of the routes
 * from the current router down to its last active descendant router.
 * @returns An array of the active routes for this router
 */
CoreRouter.prototype._getActiveRoutes = function () {
  return getActiveRoutes().slice(this._urlOffset);
};

/**
 * Create a child router from the current router. The child will be associated
 * with the parent router's state, therefore, the parent must be in a current
 * state (by calling {@link CoreRouter#go} or {@link CoreRouter#sync}). Calling
 * this method from a parent without a current state will result in an error.
 * <p>
 * Only one child router will be active per parent router, and only in the
 * parent router's current state. When the parent router changes states, and
 * the previous state had a child router, it will be disposed of. This means
 * that child routers should always be recreated each time the state is activated.
 * This is typically done in the viewmodel's constructor/initialize functions.
 * </p>
 * <p>
 * Calling this method multiple times to create history-tracking child routers
 * (while remaining on the same state) will result in an error. However, multiple
 * non-history-tracking routers are allowed.
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
 * @ojsignature [{target:"Type", value:"<ChildD extends Record<string, any> = Record<string, any>, ChildP extends Record<string, any> = Record<string, any>>",
 *               for:"genericTypeParameters",
 *               genericParameters: [{"name": "ChildD", "description": "Detail object for the child router state"},
 *                                   {"name": "ChildP", "description": "Parameters object for the child router state"}]},
 *               {target: "Type", value: "Array.<CoreRouter.DetailedRouteConfig<ChildD>|CoreRouter.RedirectedRouteConfig>", for: "routes"},
 *               {target: "Type", value: "CoreRouter.CreateOptions<ChildP>", for: "options"},
 *               {target: "Type", value: "CoreRouter<ChildD, ChildP>", for: "returns"}]
 */
CoreRouter.prototype.createChildRouter = function (routes, options = {}) {
  // If parent router is history-skipping, so are its children
  if (this._noHistory) {
    // eslint-disable-next-line no-param-reassign
    options.history = 'skip';
  }

  const cs = this._activeState;
  if (!cs) {
    throw Error(`Router(${this._name}) has no current state. Call sync() on the router first.`);
  }
  // Routers can have only one history-tracking child router per state
  if (this.childRouter && options.history !== 'skip') {
    throw Error(`Router(${this._name}) state(${cs.path}) already has a child router`);
  }
  const childRouter = new CoreRouter(routes, options, this);
  // Set the current state's childRouter
  this.childRouter = childRouter;

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

/**
 * An object describing configuration options during the creation of a root
 * CoreRouter instance.
 * @typedef {object} CoreRouter.CreateOptions
 * @property {'skip'=} history Indicate if history tracking should be skipped. By
 * default, the router will add a new history entry each time {@link CoreRouter#go}
 * is called. Setting this option to 'skip' will disable that.
 * @property {CoreRouter.UrlAdapter=} urlAdapter The adapter which handles reading
 * and writing router states from/to the browser URL. If not specified, this will
 * default to {@link UrlPathAdapter}.
 * @ojsignature [{target: "Type", value: "UrlAdapter<P>", for: "urlAdapter"},
 *               {target: "Type", value: "<P extends Record<string, any> = Record<string, any>>", for: "genericTypeParameters"}]
 */

/**
 * A route config object configures a path and associated information to which a
 * router can navigate, and is used to build the {@link CoreRouterState}
 * during transitions. This route config type can specify a detail object which
 * can be referenced in the state.
 * @typedef {object} CoreRouter.DetailedRouteConfig
 * @property {string|RegExp} path The path of the route. This may be an exact-
 * match string, or a regular expression.
 * @property {object=} detail An optional detail object which is passed to
 * the route when it is navigated to.
 * @ojsignature [{target: "Type", value: "D", for: "detail"},
 *               {target: "Type", value: "<D extends Record<string, any> = Record<string, any>>", for: "genericTypeParameters"}]
 */

/**
 * A RouteConfig object configures a path and associated information to which a
 * router can navigate, and is used to build the {@link CoreRouterState}
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
 * to the router via the {@link CoreRouter} constructor or {@link CoreRouter#createChildRouter}.
 * @interface CoreRouter.Route
 * @ojtsnamespace CoreRouter
 * @ojsignature [{
 *                target: "Type",
 *                value: "interface Route<P extends Record<string, any> = Record<string, any>>",
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
 *               {target: "Type", value: "<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>", for: "genericTypeParameters"}]
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
 *               {target: "Type", value: "<D extends Record<string, any> = Record<string, any>, P extends Record<string, any> = Record<string, any>>", for: "genericTypeParameters"}]
 */

/**
 * A UrlAdapter is used by CoreRouter to read and write router states using the
 * browser URL.
 * @interface UrlAdapter
 * @ojtsnamespace CoreRouter
 * @ojsignature {target: "Type", value: "interface UrlAdapter<P extends Record<string, any> = Record<string, any>>"}
 */
/**
 * Build all routes for the given URL. The URL is expected to start with the
 * <code>baseUrl</code> set for this adapter, because it will be subtracted
 * out before routes are built.
 * @name getRoutesForUrl
 * @memberof UrlAdapter
 * @method
 * @instance
 * @export
 * @param {object=} routePathParams An optional object that may be passed from the
 * router for the adapter parse the URL with path parameter information. The
 * object will contain the URL segment offset (segments are individual parts of
 * the path) at where the relevant state begins, and the path parameters for that
 * state as an array of strings.
 * <pre class="prettyprint">
 * <code>
 * {
 *   offset: number,
 *   pathParams: string[]
 * }
 * </code>
 * </pre>
 * If passed, the adapter should build the state with path parameter values for
 * the given offset and return it within the final array. If not passed, the
 * adapter should build the states from the URL, assuming each segment is a new
 * state.
 * @param {string=} url Optional value passed to the adapter for the current URL
 * holding the router state. This is only present when the adapter is wrapped
 * inside of {@link UrlParamAdapter} (see constructor documentation for details).
 * @return {Array.<CoreRouter.Route>} An array of all states represented
 * in the URL.
 * @ojsignature [
 * {target: "Type", value: "{offset: number, pathParams: string[]}", for: "routePathParams"},
 * {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "returns"}
 * ]
 */

/**
 * Build the URL path for the given routes.
 * @name getUrlForRoutes
 * @memberof UrlAdapter
 * @method
 * @instance
 * @export
 * @param {Array.<CoreRouter.Route>} states The set of states from which the
 * URL will be built.
 * @return {string} The full URL representative of the given routes
 * @ojsignature [
 * {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "states"},
 * {target: "Type", value: "string", for: "returns"}
 * ]
 */

export default CoreRouter;
