/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */
define(["ojs/ojlogger"],function(o){"use strict";function t(o){"@babel/helpers - typeof";return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(o){return typeof o}:function(o){return o&&"function"==typeof Symbol&&o.constructor===Symbol&&o!==Symbol.prototype?"symbol":typeof o})(o)}var e=function o(){!function(o,t){if(!(o instanceof t))throw new TypeError("Cannot call a class as a function")}(this,o)};return e.getConverterInstance=function(e){var n="",r={},a=null;if(e&&("object"===t(e)&&(e.parse&&"function"==typeof e.parse||e.format&&"function"==typeof e.format?a=e:(n=e.type,r=e.options||{})),!a&&(n=n||e)&&"string"==typeof n)){if(oj.Validation&&oj.Validation.converterFactory)return oj.Validation.converterFactory(n).createConverter(r);o.error('oj.Validation.converterFactory is not available and it is needed to support the deprecated json format for the converters property. Please include the backward compatibility "ojvalidation-base" module.')}return a},e});