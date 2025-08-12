/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
/**
 * Add a trailing slash to the given path if it doesn't already end with one.
 * @param {string} path
 */
function trailingSlash(path) {
    let copy = path;
    if (copy && !copy.match(/\/$/)) {
        copy += '/';
    }
    return copy;
}
/**
 * @param {*} value
 */
function encode(value) {
    return value && encodeURIComponent(value);
}
/**
 * @param {*} value
 */
function decode(value) {
    return value && decodeURIComponent(value);
}
class UrlPathParamAdapter {
    constructor(baseUrl) {
        this._baseUrl = trailingSlash(baseUrl !== undefined ? baseUrl : document.location.pathname);
    }
    getRoutesForUrl(routePathParams, url) {
        // If url is given, then a decorator (UrlParamAdapter) is calling us with a
        // value that it wants to have parsed. If undefined, then the router is
        // calling us directly.
        const pathname = url || document.location.pathname;
        const baseUrl = this._baseUrl;
        // Remove baseUrl from the URL
        const allSegments = pathname.substring(baseUrl.length);
        let segments = allSegments.split('/').map((segment) => decode(segment));
        const states = segments.map((path) => ({ path, params: {} }));
        // Use routePathParams to read out path/params from URL segments
        if (routePathParams) {
            // Get sub-array of segments starting at offset
            const offset = routePathParams.offset;
            segments = segments.slice(offset);
            const path = segments.shift();
            // Only build if not blank path
            if (path) {
                const params = {};
                routePathParams.pathParams.forEach((paramName) => (params[paramName] = segments.shift()));
                states[offset] = {
                    path,
                    params
                };
            }
        }
        return states;
    }
    getUrlForRoutes(states) {
        const paths = states.map((state) => {
            const pathSegments = [
                state.path,
                ...state.pathParams.map((paramName) => state.params[paramName])
            ];
            return pathSegments.map(encode).join('/');
        });
        let baseUrl = this._baseUrl;
        const fullPath = paths.join('/');
        if (fullPath) {
            baseUrl = trailingSlash(baseUrl);
        }
        return baseUrl + fullPath + document.location.search;
    }
}

export default UrlPathParamAdapter;
