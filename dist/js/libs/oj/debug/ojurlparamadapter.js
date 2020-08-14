/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojurlpathadapter', 'ojs/ojlogger'],
function(oj, UrlPathAdapter, Logger) {
  "use strict";



/* global UrlPathAdapter, Logger:false */
// eslint-disable-next-line no-unused-vars
var adapter = (function () {
  // The old (8.0.0) paramter name
  var _OLD_PARAM_NAME = '_ojCoreRouter';
  // The new (9.0.0) paramter name
  var _NEW_PARAM_NAME = 'ojr';
  var _PARAM_NAME = _OLD_PARAM_NAME;
  /**
   * Parse document.location.search into
   * [[ name, value ], [ name, value ]]
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
   */
  function recreateSearch(params) {
    var search = params.map(function (param) {
      return param[0] + '=' + param[1];
    });
    return search.join('&');
  }

  /**
   * Given search parameters from the URL, find the value of '_ojCoreRouter'
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
   */
  function encode(value) {
    var encoded = encodeURIComponent(value);
    return encoded;
  }
  /**
   * Given an encoded path (%2Fpath1%2Fpath2%2Fpath3), decode the valu and
   * return it.
   * @param {string} value The encoded path
   */
  function decode(value) {
    var decoded = decodeURIComponent(value);
    return decoded;
  }

  /**
   * @class UrlParamAdapter
   * @implements CoreRouter.UrlAdapter
   * @since 8.0.0
   * @ojsortdesc Class to synchronize CoreRouter state with the browser URL using
   * path segments.
   * @classdesc UrlParamAdapter class
   * <p>
   * A URL adapter that uses a query parameter to synchronize router state
   * (?_ojCoreRouter=...). All other query parameters are unaffected.
   * </p>
   * An alternative to UrlParamAdapter is {@link UrlPathAdapter}.
   * @export
   * @ojtsmodule
   * @ojtsimport {module: "ojcorerouter", type: "AMD", importName: "CoreRouter"}
   * @ojsignature {target: "Type",
   *               value: "class UrlParamAdapter<P extends {[key: string]: any} = {[key: string]: any}>",
   *               genericParameters: [{"name": "P", "description": "Parameters object for the router state"}]
   *              }
   */
  function UrlParamAdapter() {
    // Use UrlPathAdapter with "" as the baseUrl to handle parsing states stored
    // in the query parameter
    this._pathAdapter = new UrlPathAdapter('');
    // If _OLD_PARAM_NAME isn't in querystring, then we can use _NEW_PARAM_NAME
    if (getRouterParamValue() === undefined) {
      _PARAM_NAME = _NEW_PARAM_NAME;
    }
  }

  /**
   * Build all routes for the current router query parameter.
   * @return {Array.<CoreRouter.Route>} An array of routes starting from the path
   * for the given router.
   * @name getRoutesForUrl
   * @memberof UrlParamAdapter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "returns"}
   */
  UrlParamAdapter.prototype.getRoutesForUrl = function () {
    // If no router state query param value exists, pass path adapter blank
    // for the URL so that it generates the default route.
    var url = getRouterParamValue() || '';
    var routes = this._pathAdapter.getRoutesForUrl(url);
    return routes;
  };
  /**
   * Build the URL path for the given routes.
   * @param {Array.<CoreRouter.Route>} routes The set of routes from which the
   * URL will be built.
   * @return {string} The full URL representative of the given routes
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
    return '?' + setRouterParamValue(fullPath);
  };

  return UrlParamAdapter;
}());

  return adapter;
});
