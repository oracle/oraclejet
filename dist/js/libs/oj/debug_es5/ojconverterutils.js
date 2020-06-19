/**
 * @license
 * Copyright (c) 2014, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojlogger'], 
 function(Logger)
{
  "use strict";
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConverterUtils = function ConverterUtils() {
  _classCallCheck(this, ConverterUtils);
};

ConverterUtils.getConverterInstance = function (converterOption) {
  var cTypeStr = '';
  var cOptions = {};
  var converterInstance = null;

  if (converterOption) {
    if (_typeof(converterOption) === 'object') {
      // TODO: Should we check that it duck types Converter?
      if (converterOption.parse && typeof converterOption.parse === 'function' || converterOption.format && typeof converterOption.format === 'function') {
        // we are dealing with a converter instance
        converterInstance = converterOption;
      } else {
        // check if there is a type set
        cTypeStr = converterOption.type;
        cOptions = converterOption.options || {};
      }
    }

    if (!converterInstance) {
      // either we have an object literal or just plain string.
      cTypeStr = cTypeStr || converterOption;

      if (cTypeStr && typeof cTypeStr === 'string') {
        // if we are passed a string get registered type.
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

  ;return ConverterUtils;
});