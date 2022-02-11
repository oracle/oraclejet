/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore-base","ojs/ojlogger"],function(e,t){"use strict";e=e&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e;class o{}return o.getConverterInstance=function(o){let r="",a={},n=null;if(o&&("object"==typeof o&&(o.parse&&"function"==typeof o.parse||o.format&&"function"==typeof o.format?n=o:(r=o.type,a=o.options||{})),!n&&(r=r||o,r&&"string"==typeof r))){if(e.Validation&&e.Validation.converterFactory)return e.Validation.converterFactory(r).createConverter(a);t.error('oj.Validation.converterFactory is not available and it is needed to support the deprecated json format for the converters property. Please include the backward compatibility "ojvalidation-base" module.')}return n},o});
//# sourceMappingURL=ojconverterutils.js.map