!function(){function t(o){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(o)}
/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojlogger"],function(o,e){"use strict";o=o&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o;var n=function t(){!function(t,o){if(!(t instanceof o))throw new TypeError("Cannot call a class as a function")}(this,t)};return n.getConverterInstance=function(n){var r="",a={},i=null;if(n&&("object"===t(n)&&(n.parse&&"function"==typeof n.parse||n.format&&"function"==typeof n.format?i=n:(r=n.type,a=n.options||{})),!i&&(r=r||n)&&"string"==typeof r)){if(o.Validation&&o.Validation.converterFactory)return o.Validation.converterFactory(r).createConverter(a);e.error('oj.Validation.converterFactory is not available and it is needed to support the deprecated json format for the converters property. Please include the backward compatibility "ojvalidation-base" module.')}return i},n})}();
//# sourceMappingURL=ojconverterutils.js.map