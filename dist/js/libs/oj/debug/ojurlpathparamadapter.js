/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(function () { 'use strict';

    function trailingSlash(path) {
        let copy = path;
        if (copy && !copy.match(/\/$/)) {
            copy += '/';
        }
        return copy;
    }
    function encode(value) {
        return value && encodeURIComponent(value);
    }
    function decode(value) {
        return value && decodeURIComponent(value);
    }
    class UrlPathParamAdapter {
        constructor(baseUrl) {
            this._baseUrl = trailingSlash(baseUrl !== undefined ? baseUrl : document.location.pathname);
        }
        getRoutesForUrl(routePathParams, url) {
            const pathname = url || document.location.pathname;
            const baseUrl = this._baseUrl;
            const allSegments = pathname.substring(baseUrl.length);
            let segments = allSegments.split('/').map((segment) => decode(segment));
            const states = segments.map((path) => ({ path, params: {} }));
            if (routePathParams) {
                const offset = routePathParams.offset;
                segments = segments.slice(offset);
                const path = segments.shift();
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

    return UrlPathParamAdapter;

});
