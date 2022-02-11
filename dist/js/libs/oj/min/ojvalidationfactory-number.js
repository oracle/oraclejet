/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojvalidationfactory-base","ojs/ojconverter-number","ojs/ojvalidator-numberrange"],function(r,e,t,o){"use strict";var a={createConverter:function(r){return function(r){return new t.IntlNumberConverter(r)}(r)}};e.Validation.__registerDefaultConverterFactory(e.ConverterFactory.CONVERTER_TYPE_NUMBER,a);var n={createValidator:function(r){return function(r){return new o(r)}(r)}};e.Validation.__registerDefaultValidatorFactory(e.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE,n);var i={};return i.NumberConverterFactory=a,i.NumberRangeValidatorFactory=n,i});
//# sourceMappingURL=ojvalidationfactory-number.js.map