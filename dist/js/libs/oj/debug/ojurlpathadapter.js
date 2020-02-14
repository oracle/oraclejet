/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'ojs/ojlogger'], function(oj, Logger) {
  "use strict";



/* global Logger:false */
// eslint-disable-next-line no-unused-vars
var adapter = (function () {
  /**
   * Add a trailing slash to the given path if it doesn't already end with one.
   * @param {string} path
   */
  function trailingSlash(path) {
    var copy = path;
    if (copy && !copy.match(/\/$/)) {
      copy += '/';
    }
    return copy;
  }

  /**
   * Build a parameter string from a parameter object ({ key1: value1, key2: value2 })
   * @param {Object} params The params object
   * @return {string} The encoded parameter string ("key1=value1;key2=value2")
   */
  function buildParamsString(params) {
    var paramArray = [];
    Object.keys(params).sort().forEach(function (key) {
      var value = params[key];
      if (value !== undefined && value !== null) {
        paramArray.push(';' + key + '=' + encode(value));
      }
    });
    return paramArray.join('');
  }
  /**
   * Parse the param string and return the object representing it
   * @param {string} segment The individual segment of the URL to parse,
   * i.e., "list;param=123"
   * @return {CoreRouter.Route} An object representing the state name and parameters,
   * i.e. { path: 'list', params: { param: 123 } }
   */
  function parseUrlSegment(segment) {
    var parts = segment.split(';');
    var path = parts.shift();
    var parsed = {
      path: decode(path),
      params: {}
    };
    parts.forEach(function (part) {
      if (part) {
        var pair = part.split('=');
        parsed.params[pair[0]] = decode(pair[1]);
      }
    });
    return parsed;
  }

  function encode(value) {
    return encodeURIComponent(value);
  }

  function decode(value) {
    return decodeURIComponent(value);
  }

  /**
   * @class UrlPathAdapter
   * @implements CoreRouter.UrlAdapter
   * @since 8.0.0
   * @ojsortdesc Class to synchronize CoreRouter state with the browser URL using
   * path segments.
   * @classdesc UrlPathAdapter class
   * <p>
   * A URL adapter that uses path segments to synchronize router state
   * (/path1/path2/path3). This adapter is the default for {@link CoreRouter},
   * and should be used when the web server serving up UI content has the ability
   * to internally proxy requests from one pseudo path to another.
   * </p>
   * <p>
   * For instance,
   * if the root of your application is <code>http://localhost/</code>, then
   * router states will be added onto this root using path segments, such as
   * <code>http://localhost/path1/path</code>. This path may be bookmarked, and
   * during restoration (or browser reload), the server will be asked to serve
   * up the content from that directory. Since these are presumably virtual
   * directories (they may or may not actually exist on the server), two things
   * must happen for the UI to load correctly:
   * <ul>
   *   <li>The web server must recognize that "/path1/path2" are virtual paths
   *       and serve up the content from the root (/) instead.</li>
   *   <li><code>baseUrl</code> must be set to the correct root;
   *       in this case--"http://localhost/"</li>
   * </ul>
   * </p>
   * An alternative to UrlPathAdapter is {@link UrlParamAdapter}.
   *
   * @param {string=} baseUrl The base URL from which the application is served.
   * This value may be any string value (even blank). If not specified at all
   * (undefined), then the adapter will use document.location.pathname as its
   * base.
   * @constructor
   * @export
   * @ojtsmodule
   * @ojtsimport {module: "ojcorerouter", type: "AMD", importName: "CoreRouter"}
   * @ojsignature {target: "Type",
   *               value: "class UrlPathAdapter<P extends {[key: string]: any} = {[key: string]: any}>",
   *               genericParameters: [{"name": "P", "description": "Parameters object for the router state"}]
   *              }
   */
  function UrlPathAdapter(baseUrl) {
    this._baseUrl = trailingSlash(baseUrl !== undefined ? baseUrl : document.location.pathname);
  }
  /**
   * Build all routes for the given URL. The URL is expected to start with the
   * <code>baseUrl</code> set for this adapter, because it will be subtracted
   * out before routes are built.
   * @param {string=} url Optional URL to use. If not specified, document.location.pathname
   * is used.
   * @return {Array.<CoreRouter.Route>} An array of routes starting from the path
   * for the given router.
   * @name getRoutesForUrl
   * @memberof UrlPathAdapter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "returns"}
   */
  UrlPathAdapter.prototype.getRoutesForUrl = function (url) {
    var path = url !== undefined ? url : document.location.pathname;
    var baseUrl = this._baseUrl;
    // Remove baseUrl from the URL
    var allSegments = path.substring(baseUrl.length);
    var segments = allSegments.split('/');
    var routes = [];
    // Build a route for each path segment
    segments.forEach(function (segment) {
      var parsed = parseUrlSegment(segment);
      routes.push(parsed);
    });
    // If no routes built, then add one for default route
    if (!routes.length) {
      routes.push(parseUrlSegment(''));
    }
    return routes;
  };
  /**
   * Build the URL path for the given routes.
   * @param {Array.<CoreRouter.Route>} routes The set of routes from which the
   * URL will be built.
   * @return {string} The full URL representative of the given routes
   * @name getUrlForRoutes
   * @memberof UrlPathAdapter
   * @method
   * @instance
   * @export
   * @ojsignature {target: "Type", value: "Array.<CoreRouter.Route<P>>", for: "routes"}
   */
  UrlPathAdapter.prototype.getUrlForRoutes = function (routes) {
    var paths = [];
    routes.forEach(function (route) {
      let params = buildParamsString(route.params || {});
      paths.push(route.path + params);
    });
    var baseUrl = this._baseUrl;
    var fullPath = paths.join('/');
    // If paths, ensure trailing slash on baseUrl
    if (fullPath) {
      baseUrl = trailingSlash(baseUrl);
    }
    return baseUrl + fullPath + document.location.search;
  };

  return UrlPathAdapter;
}());

  return adapter;
});
