/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojurlpathadapter'], function (UrlPathAdapter) { 'use strict';

  UrlPathAdapter = UrlPathAdapter && Object.prototype.hasOwnProperty.call(UrlPathAdapter, 'default') ? UrlPathAdapter['default'] : UrlPathAdapter;

  // The old (8.0.0) paramter name
  var _OLD_PARAM_NAME = '_ojCoreRouter';
  // The new (9.0.0) paramter name
  var _NEW_PARAM_NAME = 'ojr';
  var _PARAM_NAME = _OLD_PARAM_NAME;
  /**
   * Parse document.location.search into
   * [[ name, value ], [ name, value ]]
   * @ignore
   */
  function parseSearch() {
    // Get search value and remove leading '?'
    var search = document.location.search ? document.location.search.substring(1) : '';
    var params = [];
    if (search) {
      search.split('&').forEach(function (pair) {
        var parts = pair.split('=');
        params.push(parts);
      });
    }
    return params;
  }

  /**
   * Given an array of
   * [[ name1, value1 ], [ name2, value2 ]]
   * recreate a search string, "name1=value1&name2=value2"
   * @param {Array<object>} params An array of param objects
   * @ignore
   */
  function recreateSearch(params) {
    var search = params.map(function (param) {
      return param[0] + '=' + param[1];
    });
    return search.join('&');
  }

  /**
   * Given search parameters from the URL, find the value of '_ojCoreRouter'
   * @ignore
   */
  function getRouterParamValue() {
    var allParams = parseSearch();
    var found = allParams.find(function (param) {
      return param[0] === _PARAM_NAME;
    });
    return found && decode(found[1]);
  }

  /**
   * Given a string of route states (/path1/path2/path3), encode the value and
   * set into the _ojCoreRouter parameter, and preserve remaining query params.
   * @param {string} routerValue The router states to set
   * @ignore
   */
  function setRouterParamValue(routerValue) {
    var newValue = encode(routerValue);
    var allParams = parseSearch();
    var found = allParams.find(function (param) {
      return param[0] === _PARAM_NAME;
    });
    if (found) {
      found[1] = newValue;
    } else {
      allParams.push([_PARAM_NAME, newValue]);
    }
    return recreateSearch(allParams);
  }

  /**
   * Given a segment-encoded path (/path1/path2/path3), URL encode the value and
   * return it.
   * @param {string} value The unencoded path
   * @ignore
   */
  function encode(value) {
    return encodeURIComponent(value);
  }
  /**
   * Given an encoded path (%2Fpath1%2Fpath2%2Fpath3), decode the valu and
   * return it.
   * @param {string} value The encoded path
   * @ignore
   */
  function decode(value) {
    return decodeURIComponent(value);
  }

  /**
   * @class UrlParamAdapter
   * @implements CoreRouter.UrlAdapter
   * @since 8.0.0
   * @classdesc Class to synchronize CoreRouter state with the browser URL using
   * a query parameter.
   * <p>
   * This URL adapter uses a query parameter to synchronize router state
   * with the URL (using <code>ojr</code> parameter). All other query parameters
   * are unaffected.
   * </p>
   * <p>
   * Since this adapter doesn't require that the server understand URL rewriting
   * (see the documentation in {@link UrlPathAdapter}), it's often used during
   * development time to easily deploy to simple servers. In order to re-use the
   * same route configurations, it's often desirable to use this adapter as a
   * decorator around another, such as with {@link UrlPathParamAdapter}.
   * <pre class="prettyprint">
   * <code>
   * new CoreRouter(
   *   [
   *     { path: 'orders/{id}/{mode}' }
   *   ],
   *   {
   *     urlAdapter: new UrlParamAdapter(
   *       new UrlPathParamAdapter(baseUrl)
   *     )
   *   }
   * )
   * </code>
   * </pre>
   * This configuration allows UrlPathParamAdapter to use the path parameters
   * defined for the route, but allows UrlParamAdapter to persist the router state
   * using query parameters, removing the need for a server capable of URL rewriting
   * during development time. The resulting URL will contain UrlParamAdapter's
   * query parameter <code>ojr</code>, which holds the value of the original URL that the
   * delegate created.
   * </p>
   *
   * <p>
   * When wrapping another adapter inside of UrlParamAdapter, the call to
   * [UrlAdapter.getRoutesForUrl]{@link UrlAdapter#getRoutesForUrl} will be passed a second arg containing
   * the normalized URL for the router state. Normally (when not wrapped),
   * adapters will read directly from the URL to parse router states. However, when
   * wrapped, the contents of the URL aren't known to the delegate, so it must rely
   * on its decorator to pass it the normalized value.
   * </p>
   *
   * <p>
   * Prior to deploying to production, UrlParamAdapter
   * is removed from the configuration, leaving UrlPathParamAdapter to parse the
   * parameters and persist them to the URL.
   * </p>
   * Alternatives to UrlParamAdapter are {@link UrlPathAdapter} and {@link UrlPathParamAdapter}.
   *
   * <h3 id="query-params-section">
   *   Query Parameters
   *   <a class="bookmarkable-link" title="Bookmarkable Link" href="#query-params-section"></a>
   * </h3>
   * UrlParamAdapter uses only one query parameter - <code>ojr</code>, to maintain
   * the router state. When manipulating query parameters, ensure this is preserved.
   * <pre class="prettyprint">
   * <code>
   * function getOjrParam() {
   *   return document.location.search.split(/[?&]/).find(kv => kv.split(/=/)[0] === 'ojr')
   * }
   *
   * router.go({ path: 'orders' })
   * .then(state => {
   *   window.history.replaceState(
   *     null,
   *     '',
   *     `${document.location.pathame}?${getOjrParam()}&deptId=123&empId=456`
   *   );
   *   return state;
   * });
   * </code>
   * </pre>
   * The application is free to manipulate any other query parameter.
   *
   * @param {CoreRouter.UrlAdapter=} pathAdapter An optional path adapter to which
   * this adapter will delegate for translating routes to paths (getUrlForRoutes)
   * and vice-versa (getRoutesForUrl). If not defined, {@link UrlPathAdapter} is
   * used.
   * </p>
   * @constructor
   * @export
   * @ojtsmodule
   * @ojtsimport {module: "ojcorerouter", type: "AMD", importName: "CoreRouter"}
   * @ojsignature {target: "Type",
   *               value: "class UrlParamAdapter<P extends {[key: string]: any} = {[key: string]: any}>",
   *               genericParameters: [{"name": "P", "description": "Parameters object for the router state"}]
   *              }
   */
  function UrlParamAdapter(pathAdapter) {
    // Use UrlPathAdapter with "" as the baseUrl to handle parsing states stored
    // in the query parameter
    this._pathAdapter = pathAdapter || new UrlPathAdapter('');
    // If _OLD_PARAM_NAME isn't in querystring, then we can use _NEW_PARAM_NAME
    if (getRouterParamValue() === undefined) {
      _PARAM_NAME = _NEW_PARAM_NAME;
    }
  }

  /**
   * Build all routes for the current router query parameter.
   * @param {object=} routePathParams An optional object that may be passed by
   * the route to parse the route path parameters for the active state.
   * See {@link UrlAdapter#getRoutesForUrl} for details.
   * @return {Array.<string[]>} An array of route path parameter names. See
   * {@link UrlAdapter#getRoutesForUrl} for details.
   * @name getRoutesForUrl
   * @memberof UrlParamAdapter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "returns"}
   */
  UrlParamAdapter.prototype.getRoutesForUrl = function (routePathParams) {
    // If no router state query param value exists, pass path adapter blank
    // for the URL so that it generates the default route.
    const urlParam = getRouterParamValue() || '';
    return this._pathAdapter.getRoutesForUrl(routePathParams, urlParam);
  };
  /**
   * Build the URL path for the given routes. See {@link UrlAdapter#getUrlForRoutes}
   * for details.
   * @param {Array.<CoreRouter.Route>} routes The set of routes from which the
   * URL will be built.
   * @return {string} The full URL representing of the given routes
   * @name getUrlForRoutes
   * @memberof UrlParamAdapter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "routes"}
   */
  UrlParamAdapter.prototype.getUrlForRoutes = function (routes) {
    var fullPath = this._pathAdapter.getUrlForRoutes(routes);
    if (fullPath.indexOf('?') > -1) {
      fullPath = fullPath.substring(0, fullPath.indexOf('?'));
    }
    return `${document.location.pathname}?${setRouterParamValue(fullPath)}`;
  };

  return UrlParamAdapter;

});
