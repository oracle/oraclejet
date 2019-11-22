/**
 * @license
 * Copyright (c) 2014, 2019, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 * @ignore
 */

define(['ojs/ojcore', 
        'jquery', 
        'ojs/ojtranslation', 
        'ojs/ojmessaging', 
        'ojs/ojlocaledata', 
        'ojs/ojlogger',
        'ojs/ojconverterutils-i18n', 
        'ojs/ojconverter', 
        'ojs/ojvalidator', 
        'ojs/ojvalidationfactory-base',
        'ojs/ojconverter-color',
        'ojs/ojvalidator-length',
        'ojs/ojvalidator-regexp',
        'ojs/ojvalidator-required',  
        'ojs/ojvalidation-error', 
        'ojs/ojvalidator-async'], 
function(oj, 
         $, 
         Translations, 
         Message, 
         LocaleData, 
         Logger, 
         __ConverterI18nUtils, 
         Converter, 
         Validator,
         __ValidationFactoryBase,
         ColorConverter, 
         LengthValidator, 
         RegExpValidator, 
         RequiredValidator)
{
  "use strict";

/* global __ValidationFactoryBase:false, ColorConverter:false, __ConverterI18nUtils:false,
LengthValidator:false, RegExpValidator:false, RequiredValidator:false,
Converter:false, Validator:false */
// These were refactored into their own module which
// does not register anymore the object into the oj namespace.
// But to remain backward compatible, bleed back here.
oj.ColorConverter = ColorConverter;
oj.LengthValidator = LengthValidator;
oj.RegExpValidator = RegExpValidator;
oj.RequiredValidator = RequiredValidator;
oj.IntlConverterUtils = __ConverterI18nUtils.IntlConverterUtils;
oj.OraI18nUtils = __ConverterI18nUtils.OraI18nUtils;
oj.Converter = Converter;
oj.Validator = Validator;
oj.Validation = __ValidationFactoryBase.Validation;
oj.ValidatorFactory = __ValidationFactoryBase.ValidatorFactory;
oj.ConverterFactory = __ValidationFactoryBase.ConverterFactory;

var __ValidationBase = {};
__ValidationBase.ColorConverter = oj.ColorConverter;
__ValidationBase.IntlConverterUtils = oj.IntlConverterUtils;
__ValidationBase.LengthValidator = oj.LengthValidator;
__ValidationBase.RegExpValidator = oj.RegExpValidator;
__ValidationBase.RequiredValidator = oj.RequiredValidator;
__ValidationBase.Validation = oj.Validation;

  ;return __ValidationBase;
});