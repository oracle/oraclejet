(function() {
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @license
 * Copyright (c) 2014, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(['ojs/ojcore-base', 'ojs/ojlogger'], function (oj, Logger) {
  'use strict';

  oj = oj && Object.prototype.hasOwnProperty.call(oj, 'default') ? oj['default'] : oj;

  var ConverterUtils = function ConverterUtils() {
    _classCallCheck(this, ConverterUtils);
  };

  ConverterUtils.getConverterInstance = function (converterOption) {
    var cTypeStr = '';
    var cOptions = {};
    var converterInstance = null;

    if (converterOption) {
      if (_typeof(converterOption) === 'object') {
        if (converterOption.parse && typeof converterOption.parse === 'function' || converterOption.format && typeof converterOption.format === 'function') {
          converterInstance = converterOption;
        } else {
          cTypeStr = converterOption.type;
          cOptions = converterOption.options || {};
        }
      }

      if (!converterInstance) {
        cTypeStr = cTypeStr || converterOption;

        if (cTypeStr && typeof cTypeStr === 'string') {
          if (oj.Validation && oj.Validation.converterFactory) {
            var cf = oj.Validation.converterFactory(cTypeStr);
            return cf.createConverter(cOptions);
          } else {
            Logger.error('oj.Validation.converterFactory is not available and it is needed to support the deprecated json format for the converters property. Please include the backward compatibility "ojvalidation-base" module.');
          }
        }
      }
    }

    return converterInstance;
  };

  return ConverterUtils;
});

}())