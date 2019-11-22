/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojurlpathadapter', 'ojs/ojlogger'],
function(oj, UrlPathAdapter, Logger) {
  "use strict";



/* global UrlPathAdapter, Logger:false */
// eslint-disable-next-line no-unused-vars
var adapter = (function () {
  var _PARAM_NAME = '_ojCoreRouter';
  /**
   * Parse document.location.search into
   * [{ name: value }, { name: value }]
   */
  function parseSearch() {
    // Get search value and remove leading '?'
    var search = document.location.search ? document.location.search.substring(1) : '';
    var params = [];
    if (search) {
      search.split('&').forEach(function (pair) {
        var parts = pair.split('=');
        params.push({ [parts[0]]: decode(parts[1]) });
      });
    }
    return params;
  }

  /**
   * Given an array of
   * [{ name1: value1 }, { name2: value2 }]
   * recreate a search string, "name1=value1&name2=value2"
   * @param {Array<object>} params An array of param objects
   */
  function recreateSearch(params) {
    var search = [];
    params.forEach(function (param) {
      // Only one key for each pair
      var name = Object.keys(param)[0];
      search.push(name + '=' + encode(param[name]));
    });
    return search.join('&');
  }

  /**
   * Given search parameters [ { _ojCoreRouter: '...'}, { foo: 'bar' } ], find
   * the '_ojCoreRouter' value
   */
  function getRouterParamValue() {
    var allParams = parseSearch();
    var routerValue = '';
    allParams.forEach(function (param) {
      if (param[_PARAM_NAME]) {
        routerValue = param[_PARAM_NAME];
      }
    });
    return routerValue;
  }

  /**
   * Given a string of route states (/path1/path2/path3), encode the value and
   * set into the _ojCoreRouter parameter, and preserve remaining query params.
   * @param {string} routerValue The router states to set
   */
  function setRouterParamValue(routerValue) {
    var allParams = parseSearch();
    var ojParamExists = false;
    allParams.forEach(function (param) {
      if (param[_PARAM_NAME]) {
        // eslint-disable-next-line no-param-reassign
        param[_PARAM_NAME] = routerValue;
        ojParamExists = true;
      }
    });
    // If no _ojCoreRouter param exists, create it
    if (!ojParamExists) {
      allParams.push({ [_PARAM_NAME]: routerValue });
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
   */
  function UrlParamAdapter() {
    this._pathAdapter = new UrlPathAdapter('');
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
   */
  UrlParamAdapter.prototype.getRoutesForUrl = function () {
    var url = getRouterParamValue();
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
