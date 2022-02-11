/**
 * @license
 * Copyright (c) 2014, 2022, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
define(["ojs/ojcore","ojs/ojvalidationfactory-base","ojs/ojconverter-datetime","ojs/ojvalidator-datetimerange","ojs/ojvalidator-daterestriction"],function(t,r,a,e,o){"use strict";var n={createConverter:function(t){return function(t){return new a.IntlDateTimeConverter(t)}(t)}};r.Validation.__registerDefaultConverterFactory(r.ConverterFactory.CONVERTER_TYPE_DATETIME,n);var i={createValidator:function(t){return function(t){return new e(t)}(t)}};r.Validation.__registerDefaultValidatorFactory(r.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE,i);var c={createValidator:function(t){return function(t){return new o(t)}(t)}};r.Validation.__registerDefaultValidatorFactory(r.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION,c);var d={};return d.DateTimeConverterFactory=n,d.DateTimeRangeValidatorFactory=i,d.DateRestrictionValidatorFactory=c,d});
//# sourceMappingURL=ojvalidationfactory-datetime.js.map