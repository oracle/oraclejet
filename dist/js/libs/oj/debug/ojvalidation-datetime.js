/**
 * @license
 * Copyright (c) 2014, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojtranslation', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojlocaledata', 
'ojs/ojvalidation-base', 'ojs/ojlogger', 'ojs/ojvalidator-datetimerange',
'ojs/ojvalidator-daterestriction', 'ojs/ojconverter-datetime',   
'ojs/ojvalidationfactory-datetime'], 
function(oj, $, Config, Translations, ojld, LocaleData, 
__ValidationBase, Logger, DateTimeRangeValidator, 
DateRestrictionValidator, __ConverterDateTime, __ValidationFactoryDateTime)
{
  "use strict";


/* global DateTimeRangeValidator:false, DateRestrictionValidator:false, __ConverterDateTime:false, __ValidationFactoryDateTime:false */
// These were refactored into their own module which
// does not register anymore the object into the oj namespace.
// But to remain backward compatible, bleed back here.
oj.DateTimeRangeValidator = DateTimeRangeValidator;
oj.DateRestrictionValidator = DateRestrictionValidator;
oj.DateTimeConverter = __ConverterDateTime.DateTimeConverter;
oj.IntlDateTimeConverter = __ConverterDateTime.IntlDateTimeConverter;
oj.DateTimeConverterFactory = __ValidationFactoryDateTime.DateTimeConverterFactory;
oj.DateTimeRangeValidatorFactory = __ValidationFactoryDateTime.DateTimeRangeValidatorFactory;
oj.DateRestrictionValidatorFactory = __ValidationFactoryDateTime.DateRestrictionValidatorFactory;

var __ValidationDateTime = {};
__ValidationDateTime.DateRestrictionValidator = oj.DateRestrictionValidator;
__ValidationDateTime.DateTimeConverter = oj.DateTimeConverter;
__ValidationDateTime.DateTimeRangeValidator = oj.DateTimeRangeValidator;
__ValidationDateTime.IntlDateTimeConverter = oj.IntlDateTimeConverter;

  ;return __ValidationDateTime;
});