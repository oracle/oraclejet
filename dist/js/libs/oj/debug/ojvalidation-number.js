/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 'jquery', 'ojs/ojconfig', 'ojs/ojtranslation', 
'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojlocaledata', 
'ojs/ojvalidation-base', 'ojs/ojlogger', 
'ojs/ojvalidator-numberrange', 'ojs/ojconverter-number', 
'ojs/ojvalidationfactory-number'], 
function(oj, $, Config, Translations, ojld, LocaleData, __ValidationBase, Logger,
NumberRangeValidator, __NumberConverter, __ValidationFactoryNumber)
{
  "use strict";

/* global NumberRangeValidator:false, __NumberConverter:false,
LengthValidator:false, RegExpValidator:false, RequiredValidator:false,
__ValidationFactoryNumber:false */
// These were refactored into their own module which
// does not register anymore the object into the oj namespace.
// But to remain backward compatible, bleed back here.
oj.NumberRangeValidator = NumberRangeValidator;
oj.NumberConverter = __NumberConverter.NumberConverter;
oj.IntlNumberConverter = __NumberConverter.IntlNumberConverter;
oj.NumberConverterFactory = __ValidationFactoryNumber.NumberConverterFactory;
oj.NumberRangeValidatorFactory = __ValidationFactoryNumber.NumberRangeValidatorFactory;

var __ValidationNumber = {};
__ValidationNumber.NumberConverter = oj.NumberConverter;
__ValidationNumber.NumberRangeValidator = oj.NumberRangeValidator;
__ValidationNumber.IntlNumberConverter = oj.IntlNumberConverter;

  ;return __ValidationNumber;
});