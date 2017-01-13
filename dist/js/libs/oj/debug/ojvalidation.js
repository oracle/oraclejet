/**
 * Copyright (c) 2014, 2017, Oracle and/or its affiliates.
 * The Universal Permissive License (UPL), Version 1.0
 */
"use strict";
define(['ojs/ojcore', 'jquery', 'ojL10n!ojtranslations/nls/localeElements', 'ojs/ojmessaging'], function(oj, $, ojld)
{
/*
** Copyright (c) 2008, 2013, Oracle and/or its affiliates. All rights reserved.
**
**34567890123456789012345678901234567890123456789012345678901234567890123456789
*/

/*global ojld:true*/

/**
 * @class Locale Data Services
 * @export
 * @since 0.6
 */
oj.LocaleData = {};

/**
 * Sets the Locale Elements bundle used by JET
 * If an AMD loader (such as Require.js) is not present, this method should be called by the application to provide
 * a Locale Elements for JET.
 * This method may also be used by an application that wants to completely replace the Locale Elements bundle that is automatically
 * fetched by an AMD loader.
 * @param {Object} bundle resource bundle that should be used by the framework
 * @export
 */
oj.LocaleData.setBundle = function(bundle)
{
  oj.LocaleData._bundle = bundle;
};

/**
 * Retrieves the first day of week for the current locale's region
 * @return {number} a numeric representation of the first week day of the week: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getFirstDayOfWeek = function()
{
  return oj.LocaleData._getWeekData("firstDay");
};

/**
 * Retrieves the first weekend day for the current locale's region
 * @return {number} a numeric representation of the first weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendStart = function()
{
  return oj.LocaleData._getWeekData("weekendStart");
};

/**
 * Retrieves the last weekend day for the current locale's region
 * @return {number} a numeric representation of the last weekend day: 
 * 0 for Sunday, 1 for Monday, etc.
 * @export
 */
oj.LocaleData.getWeekendEnd = function()
{
  return oj.LocaleData._getWeekData("weekendEnd");
};

/**
 * Retrieves locale-specific names of the days of the week
 * @return {Array.<string>} names of the days from Sunday through Sturday
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getDayNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var days = oj.LocaleData._getCalendarData()["days"]["stand-alone"][type];
  
  return [days["sun"], days["mon"], days["tue"], days["wed"], days["thu"],  days["fri"],  days["sat"]];
};

/**
 * Retrieves locale-specific names of months
 * @return {Array.<string>} names of months from January through December
 * @param {string} type - the type of the name. Currently, "abbreviated", "narrow" and "wide" are supported
 * @export
 */
oj.LocaleData.getMonthNames = function(type)
{
  if (type== null || (type !== "abbreviated" && type !== "narrow"))
  {
    type = "wide";
  }
  var months = oj.LocaleData._getCalendarData()["months"]["stand-alone"][type];
  
  return [months["1"], months["2"], months["3"], months["4"], months["5"], months["6"],
           months["7"], months["8"], months["9"], months["10"], months["11"], months["12"]];
};

/**
 * Retrieves whether month is displayed prior to year
 * @return {boolean} whether month is prior to year
 * @export
 */
oj.LocaleData.isMonthPriorToYear = function() 
{
  var longDateFormat = oj.LocaleData._getCalendarData()["dateFormats"]["long"].toUpperCase(),
      monthIndex = longDateFormat.indexOf("M"),
	  yearIndex = longDateFormat.indexOf("Y");
  
  return monthIndex < yearIndex;
}

/**
 * @hidden
 * @private
 */
oj.LocaleData._getWeekData = function(key)
{
  var b = oj.LocaleData.__getBundle();
  var defRegion = "001";
  var region = oj.LocaleData._getRegion() || defRegion;
  
  var data = b["supplemental"]["weekData"][key];
  
  var val = data[region];
  
  if (val === undefined)
  {
    val = data[defRegion];
  }
  
  return val;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getCalendarData = function()
{
   var b = oj.LocaleData.__getBundle();
   var main  = b['main'];
   
   // skip one level (the name of the locale)
   var data, p;
   for (p in main)
   {
     if (main.hasOwnProperty(p)) {
        data = main[p];
        break;
     }
   }
   return data['dates']['calendars']['gregorian'];
};

/**
 * @hidden
 * @private
 */
oj.LocaleData._getRegion = function()
{
  var locale = oj.Config.getLocale();
  if (locale)
  {
    var tokens = locale.toUpperCase().split(/-|_/);
    if (tokens.length >= 2)
    {
      var tag = tokens[1];
      if (tag.length == 4) // this is a script tag
      {
        if (tokens.length >= 3)
        {
          return tokens[2];
        }
      }
      else
      {
        return tag;
      }
    }
  }
  return null;
};

/**
 * @hidden
 * @private
 */
oj.LocaleData.__getBundle = function()
{
  var b = oj.LocaleData._bundle;
  if (b)
  {
    return b;
  }
  
  if (oj.__isAmdLoaderPresent()) {
    oj.Assert.assert(ojld !== undefined, "LocaleElements module must be loaded");
    return ojld;
  }
  return {};
};

/**
 * Called from oj.Config after AMD loader fetches LocaleElements for the new locale.
 *
 * @hidden
 * @private
 * 
 */
oj.LocaleData.__updateBundle = function(bundle)
{
  ojld = bundle;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * The ojvalidation module.
 * @name oj.Validation
 * @class 
 * @export
 * @since 0.6
 * 
 */
oj.Validation = {};

/**
 * Internal properties to hold all factory provider callbacks or instances by name
 * @private
 */
oj.Validation._converterFactories = {}; oj.Validation._validatorFactories = {};

/**
 * Internal properties to hold the default factory instances.
 * @private
 */
oj.Validation._defaultConverterFactories = {}; oj.Validation._defaultValidatorFactories = {};

/**
 * Internal property that identifies the type that is the contract for conveters and validators.
 * @private
 */
oj.Validation._CONTRACTS = {'converter' : {name: "oj.ConverterFactory",  type: oj.ConverterFactory},
                            'validator': {name: "oj.ValidatorFactory", type: oj.ValidatorFactory}};

/**
 * Module method to register and retrieve converter factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. Callers can 
 * expect to get back the default 'number' and 'datetime' converters. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the converter factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ConverterFactory.
 * 
 * @export
 * @see oj.ConverterFactory
 */
oj.Validation.converterFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._converterFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._converterFactories,
                                              oj.Validation._CONTRACTS['converter']);
  }
  
  return retValue;
};

/**
 * Module method to register and retrieve validator factory instances by name. 
 * When passed only the name, an existing factory (registered for the name) is returned. 
 * When passed two arguments, a new factory for the name is registered. If the name already exists 
 * the new instance replaces the old one. 
 * 
 * @param {string} type a case insensitive name of the validator factory. 
 * @param {Object=} instance the instance of the factory that implements the contract for 
 * oj.ValidatorFactory.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.validatorFactory = function (type, instance)
{
  var retValue;
  if (type && !instance)
  {
    // getter
    retValue = oj.Validation._getFactory(type, oj.Validation._validatorFactories);
  }
  else if (type && instance)
  {
    // setter
    retValue = oj.Validation._registerFactory(type, 
                                              instance, 
                                              oj.Validation._validatorFactories, 
                                              oj.Validation._CONTRACTS['validator']);
  }
  
  return retValue;
};

/**
 * Returns the default converter factory instances for the supported types as defined by the 
 * oj.ConverterFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ConverterFactory
 * 
 */
oj.Validation.getDefaultConverterFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultConverterFactories);
};

/**
 * Returns the default validator factory instance for the requested types as defined by the 
 * oj.ValidatorFactory.
 * 
 * @param {string} type The default converter factory for the type. Supported types are 'number' and 
 * 'datetime'
 * @return {Object} an instance of oj.ConverterFactory or null if an unknown type is requested.
 * 
 * @export
 * @see oj.ValidatorFactory
 */
oj.Validation.getDefaultValidatorFactory = function (type)
{
  return oj.Validation._getFactory(type, oj.Validation._defaultValidatorFactories);
};

// PACKAGE PRIVATE METHODS
/**
 * Called only by internal jet converter factory implementations.
 * 
 * @param {string} name
 * @param {Object} instance
 * @private
 */
oj.Validation.__registerDefaultConverterFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['converter'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultConverterFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._converterFactories, contractDef);
};

/**
 * Called only by internal jet validator factory implementations.
 * 
 * @param {string} name of the validator factory
 * @param {Object} instance of the validator factory that creates instances of the validator
 * @private
 */
oj.Validation.__registerDefaultValidatorFactory = function (name, instance)
{
  // save to both factories
  var contractDef = oj.Validation._CONTRACTS['validator'];
  oj.Validation._registerFactory (name, instance, oj.Validation._defaultValidatorFactories, contractDef);
  oj.Validation._registerFactory(name, instance, oj.Validation._validatorFactories, contractDef);
};


/**
 * Checks that the instance implements the interface type. If it doesn't it throws an error.
 * @param {Object} instance
 * @param {Object} type
 * @param {string} typeName 
 * @throws {Error} if instance does not implement the methods defined on type.  
 * @private
 */
oj.Validation._doImplementsCheck = function (instance, type, typeName)
{
  if (type)
  {
    // Check that instance duck types providerType
    if (!oj.Validation._quacksLike(instance, type))
    {
      throw new Error("Factory instance does not implement the methods expected by the factory of type " + typeName);
    }
  }
};

/**
 * Retrieves the converter factory by name from the provided factories.
 * @private
 */
oj.Validation._getFactory = function(name, factories)
{
  oj.Assert.assertString(name);
  var cachedInstance = null;
  
  if (name)
  {
    name = name.toLowerCase();

    // getter called to retrieve the factory instance 
    var providerProps = factories[name] || {}; 
    cachedInstance = providerProps['instance'] || null;
  }
  // TODO: log a warning that name is null
  return cachedInstance;
};

/**
 * Tests whether an object 'quacks like a duck'. Returns `true` if the thingie has all of the 
 * methods of the second, parameter 'duck'. Returns `false` otherwise. 
 *
 * @param {Object} thingie the object to test.
 * @param {Object} duck The archetypal object, or 'duck', that the test is against.
 * @private
*/
oj.Validation._quacksLike = function(thingie, duck) 
{
  var valid = true, property;

  oj.Assert.assertObject(thingie);
  oj.Assert.assertObject(duck);

  for (property in duck) 
  {
    // Ensure that thingie defines the same functions as duck. We don't care about other properties
    if (duck.hasOwnProperty(property)) 
    {
      if (typeof duck[property] === "function" && 
              !thingie[property] && typeof thingie[property] !== "function") 
      {
        valid = false;
        break;
      }
    }
  }
  
  return valid;
};

/**
 * Registers the factory instance by the name, storing it into the factories object, after ensruing 
 * that the instance duck types the specified contract.
 * 
 * @private
 */
oj.Validation._registerFactory = function(name, instance, factories, contractDef)
{
  oj.Assert.assertString(name);
  oj.Assert.assertObject(instance);

  if (name)
  {
    // set new provider factory function clearing out the previously stored instance
    var props = {};
    props['instance'] = instance;
    oj.Validation._doImplementsCheck(instance, contractDef.type, contractDef.name);

    // Save to default and public factories
    factories[name.toLowerCase()] = props;
  }
};

/**
 * Contract for a ConverterFactory that provides a factory method to create a converter instance for 
 * the requested type. JET provides 2 factory implementations for number and datetime types that 
 * implement this contract. Customers can register custom converter factories for the supported 
 * types or create and register factories for new types altogether.
 * 
 * @name oj.ConverterFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.NumberConverterFactory
 * @see oj.DateTimeConverterFactory
 */
oj.ConverterFactory = 
{
  /**
   * Default type for a factory used to create number converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * number converter factory of type {@link oj.NumberConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_NUMBER" : 'number',
  
  /**
   * Default type for a factory used to create datetime converters. This type is passed to the 
   * [Validation.converterFactory]{@link oj.Validation#converterFactory} method to retrieve the 
   * datetime converter factory of type {@link oj.DateTimeConverterFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "CONVERTER_TYPE_DATETIME" : 'datetime',

  /**
   * Creates an immutable converter instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the converter 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a converter instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   */
  createConverter : function(options) {}  
};

/**
 * Contract for a ValidatorFactory that provides a factory method to create a validator instance for 
 * the requested type. JET provides several factory implementations that implement this contract - 
 * for example dateRestriction, dateTimeRange, numberRange, length, required, regexp. Customers can 
 * register custom validator factories for the supported types or create and register factories for 
 * new types altogether.
 * 
 * @name oj.ValidatorFactory
 * @abstract
 * @class
 * @export
 * @see oj.Validation
 * @see oj.DateRestrictionValidatorFactory
 * @see oj.DateTimeRangeValidatorFactory
 * @see oj.LengthValidatorFactory
 * @see oj.NumberRangeValidatorFactory
 * @see oj.RegExpValidatorFactory
 * @see oj.RequiredValidatorFactory
 */
oj.ValidatorFactory = 
{
  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * required validator factory of type {@link oj.RequiredValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REQUIRED" : 'required',
          
  /**
   * Default type for a factory used to create regExp validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * regExp validator factory of type {@link oj.RegExpValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_REGEXP" : 'regexp',

  /**
   * Default type for a factory used to create numberRange validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * numberRange validator factory of type {@link oj.NumberRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_NUMBERRANGE" : 'numberRange',

  /**
   * Default type for a factory used to create length validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * length validator factory of type {@link oj.LengthValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_LENGTH" : 'length',

  /**
   * Default type for a factory used to create required validators. This type is passed to the 
   * [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateTimeRange validator factory of type {@link oj.DateTimeRangeValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATETIMERANGE" : 'dateTimeRange',
  
  /**
   * Default type for a factory used to create date restriction validators. This type is passed to 
   * the [Validation.validatorFactory]{@link oj.Validation#validatorFactory} method to retrieve the 
   * dateRestriction validator factory of type {@link oj.DateRestrictionValidatorFactory}. 
   * @expose
   * @const
   * @member
   * @type {string}
   */
  "VALIDATOR_TYPE_DATERESTRICTION" : 'dateRestriction',
          
  /**
   * Creates an immutable validator instance of the type the factory implements. 
   * 
   * @param {(Object|null)} options an object literal containing properties required by the validator 
   * for its initialization. The properties provided in the options is implementation specific.
   * 
   * @return {Object} a validator instance.
   * @throws {TypeError} if an unrecognized type was provided 
   * @expose
   */
  createValidator : function(options) {}  
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Converter Contract
 */

/**
 * Constructs an immutable instance of Converter.
 * 
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 * @constructor
 * @since 0.6
 */
oj.Converter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Converter, oj.Object, "oj.Converter");


/**
 * Initializes converter instance with the set options
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.Converter.prototype.Init = function(options) 
{
  oj.Converter.superclass.Init.call(this);
  // should we make options truly immutable? non-configurable, non-enumerable, non-writable
  // Object.defineProperty(oj.Converter.prototype, "_options", {value: options});
  this._options = options;
};

/**
 * Returns a hint that describes the converter format expected.
 * @return {String|null} a hint describing the format the value is expected to be in.
 * @export
 */
oj.Converter.prototype.getHint = function () 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.Converter.prototype.getOptions = function () 
{
  return (this._options || {});
};

/**
 * Parses a String value using the options provided. 
 * 
 * @param {String} value to parse
 * @return {(Number|Date)} the parsed value. 
 * @throws {Error} if parsing fails
 * @export
 */
oj.Converter.prototype.parse = function (value) 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Formats the value using the options provided. 
 * 
 * @param {(Number|Date)} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} if formatting fails.
 * @export
 */
oj.Converter.prototype.format = function (value) 
{
  oj.Assert.failedInAbstractFunction();
  return null;
};

/**
 * Returns an object literal with locale and formatting options computed during initialization of 
 * the object. If options was not provided at the time of initialization, the properties will be 
 * derived from the locale defaults.
 * @return {Object} an object of resolved options.
 * @export
 */
oj.Converter.prototype.resolvedOptions = function ()
{
  var resolved = {};
  // returns a clone of this._options
  $.extend(resolved, this._options);
  
  return resolved;
};


// oj.ConverterError

/**
 * Constructs a ConverterError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ConverterError = function (summary, detail)
{
  var message = new oj.Message(summary, detail, oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ConverterError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Converter Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @return {Object} instance of oj.Message
 * @export
 */
oj.ConverterError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.NumberConverter Contract. 
 */

/**
 * @export
 * @constructor
 * @augments oj.Converter 
 * @name oj.NumberConverter
 * @since 0.6
 */
oj.NumberConverter = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberConverter, oj.Converter, "oj.NumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.NumberConverter.prototype.Init = function(options) 
{
  oj.NumberConverter.superclass.Init.call(this, options);
};

/**
 * Formats the Number value using the options provided and returs a String value.
 * 
 * @param {Number} value the value to be formatted for display
 * @return {(String|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 */
oj.NumberConverter.prototype.format = function (value) 
{
  return oj.NumberConverter.superclass.format.call(this, value);
};

/**
 * Parses the value using the options provided and returns a Number object.
 * 
 * @param {String} value to parse
 * @return {Number} the parsed value as a Number object.
 * @throws {Error} a ConverterError if parsing fails
 * @export
 */
oj.NumberConverter.prototype.parse = function (value) 
{
  return oj.NumberConverter.superclass.parse.call(this, value);
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * oj.DateTimeConverter Contract. 
 */

/**
 * @constructor
 * @param {Object=} options an object literal used to provide an optional information to 
 * @augments oj.Converter 
 * @name oj.DateTimeConverter
 * @export
 * @since 0.6
 */
oj.DateTimeConverter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateTimeConverter, oj.Converter, "oj.DateTimeConverter");

/**
 * Initializes the date time converter instance with the set options.
 * 
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.DateTimeConverter.prototype.Init = function(options) 
{
  oj.DateTimeConverter.superclass.Init.call(this, options);
};

/**
 * Formats the local isoString value using the options provided and returns a string value. Note that if previous application 
 * code was passing a JavaScript Date object which is no longer supported, one can use the utility function oj.IntlConverterUtils.dateToLocalIso 
 * to get the proper isoString value.
 * 
 * @example <caption>For example <code class="prettyprint">converter.format(oj.IntlConverterUtils.dateToLocalIso(new Date()))</code></caption>
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @param {string} value to be formatted for display which should be a local isoString
 * @return {(string|null)} the localized and formatted value suitable for display
 * @throws {Error} a ConverterError if formatting fails.
 * @export
 */
oj.DateTimeConverter.prototype.format = function (value) 
{
  return oj.DateTimeConverter.superclass.format.call(this, value);
};


/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isHourInDaySet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isHourInAMPMSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMinuteSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isSecondSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMilliSecondSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isYearSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if month is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isMonthSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isDaySet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @export
 */
oj.DateTimeConverter.prototype.isDayNameSet = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns the calculated week for the isoString value.
 * @export
 */
oj.DateTimeConverter.prototype.calculateWeek = function()
{
  oj.Assert.failedInAbstractFunction();
};

/**
 * Parses the value using the options provided and returns a local isoString value. For convenience if one wishes to 
 * retrieve a JavaScript Date object from the local isoString an utility function oj.IntlConverterUtils.isoToLocalDate is 
 * provided.
 * 
 * @example <caption>For example <code class="prettyprint">oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString))</code></caption>
 * @see oj.IntlConverterUtils.isoToLocalDate
 * @param {string} value to parse
 * @return {string} the parsed value as a local isoString value
 * @throws {Error} a ConverterError if parsing fails
 * @export
 */
oj.DateTimeConverter.prototype.parse = function (value) 
{
  return oj.DateTimeConverter.superclass.parse.call(this, value);
};

/**
 * Compares 2 ISO 8601 strings, returning the time difference between the two
 * 
 * @param {string} isoStr first iso string
 * @param {string} isoStr2 second iso string
 * @return {number} the time difference between isoStr and isoStr2
 * @export
 */
oj.DateTimeConverter.prototype.compareISODates = function (isoStr, isoStr2)
{
  return oj.DateTimeConverter.superclass.compareISODates.call(this, isoStr, isoStr2);
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Validator Contract
 */

/**
 * @constructor
 * @export
 * @since 0.6
 * 
 */
oj.Validator = function()
{
  this.Init();
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.Validator, oj.Object, "oj.Validator");

/**
 * Initializes validator instance with the set options
 * @export
 */
oj.Validator.prototype.Init = function() 
{
  oj.Validator.superclass.Init.call(this);
};

/**
 * Vaidates the value.
 * 
 * @param {Object} value to be validated
 * @return {*} a boolean true if validation passes.
 * @throws Error if validation fails
 * @export
 */
oj.Validator.prototype.validate = function (value) {
  oj.Assert.failedInAbstractFunction();
};

/**
 * Returns a hint that describes the validator rule.
 * @returns {*} a hint string or null
 * @export
 */
oj.Validator.prototype.getHint = function () 
{
  oj.Assert.failedInAbstractFunction();
};

// ValidatorError

/**
 * Constructs a ValidatorError instance from a summary and detail 
 * 
 * @param {string} summary a localized String that provides a summary of the error
 * @param {string} detail a localized String that provides a detail of the error
 * @constructor
 * @export
 */
oj.ValidatorError = function (summary, detail)
{
  var message = new oj.Message(summary, 
                               detail, 
                               oj.Message.SEVERITY_LEVEL['ERROR']);
  this.Init(message); 
};

oj.ValidatorError.prototype = new Error();

/**
 * Initializes the instance. 
 * @param {Object} message an instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.Init = function (message)
{
  var detail = message['detail'], summary = message['summary'];
  this._message = message;

  // so browser can get to e.name and e.message 
  this.name = 'Validator Error';
  this.message = detail || summary;
};

/**
 * Returns an instance of oj.Message.
 * 
 * @returns {Object} instance of oj.Message
 * @export
 */
oj.ValidatorError.prototype.getMessage = function ()
{
  return this._message;
};
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RequiredValidator that ensures that the value provided is not empty
 * @param {Object=} options an object literal used to provide an optional hint and error message.<p>
 * @param {string=} options.hint an optional hint text. There is no default hint provided by this 
 * validator.
 * @param {string=} options.messageSummary - an optional custom error message summarizing the 
 * error. When not present, the default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.required.summary</code>.<p>
 * <p>The messageSummary string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: {label} - this token can be used to substitute the label of the component at runtime. </p>
 * <p>
 * Example:<br/>
 * "'{label}' Required"<br/>
 * </p>
 * @param {string=} options.messageDetail - a custom error message used for creating detail part 
 * of message, when the value provided is empty. When not present, the default message detail is the 
 * resource defined with the key <code class="prettyprint">oj-validator.required.detail</code>.
 * <p>The messageDetail string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * <p>Tokens: {label} - this token can be used to substitute the label of the component at runtime.</p>
 * <p>
 * Example:<br/>
 * "A value is required for the field '{label}'."<br/>
 * </p>
 * 
 * @export
 * @constructor
 * @since 0.6
 * 
 */
oj.RequiredValidator = function (options)
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RequiredValidator, oj.Validator, "oj.RequiredValidator");

// key to access required validator specific resources in the bundle 
oj.RequiredValidator._BUNDLE_KEY_DETAIL = "oj-validator.required.detail";
oj.RequiredValidator._BUNDLE_KEY_SUMMARY = "oj-validator.required.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.Init = function (options)
{
  oj.RequiredValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value to be non-empty
 * 
 * @param {Object|string|number} value that is being validated 
 * @returns {boolean} true if validation was was successful the value is non-empty
 * 
 * @throws {Error} when fails required-ness check
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.validate = function (value)
{
  var detail;
  var label = "";
  var localizedDetail;
  var localizedSummary;
  var summary;
  var params = {};

  // checks for empty arrays and String. Objects are considered non-null.
  // Need to specifically test for if value is 0 first if number is passed on.
  if ((typeof value === "number" && value === 0) || (value && value.length !== 0))
  {
    return true;
  }
  else
  {
    if (this._options)
    {
      // we have deprecated support for message param and instead use messageDetail.
      detail = this._options['messageDetail'] || this._options['message'] || null;
      summary = this._options['messageSummary'] || null;
      label = this._options['label'] || "";
    }
    params = {'label': label};
    localizedSummary = (summary) ? oj.Translations.applyParameters(summary, params) :
    oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ?
    oj.Translations.applyParameters(detail, params) :
    oj.Translations.getTranslatedString(this._getDetailKey(), params);

    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }

};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|string|null} a hint message or null if no hint is available in the options
 * @memberof oj.RequiredValidator
 * @instance
 * @export
 */
oj.RequiredValidator.prototype.getHint = function ()
{
  var hint = "";
  if (this._options && (this._options['hint']))
  {
    hint = oj.Translations.getTranslatedString(this._options['hint']);
  }

  return hint;
};

oj.RequiredValidator.prototype._getSummaryKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_SUMMARY;
};

oj.RequiredValidator.prototype._getDetailKey = function ()
{
  return oj.RequiredValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Constructs a DateRestrictionValidator that ensures the value provided is not in a disabled entry of dayMetaData
 * @param {Object=} options an object literal used to provide the following properties
 * @param {Function=} options.dayFormatter - Additional info to be used when rendering the day. This 
 * should be a JavaScript Function callback which accepts as its argument the following JSON format 
 * <code class="prettyprint">{fullYear: Date.getFullYear(), month: Date.getMonth()+1, date: Date.getDate()}</code>
 * and returns <code class="prettyprint">null</code> or all or partial JSON data of the form 
 * <code class="prettyprint">{disabled: true|false, className: "additionalCSS", tooltip: 'Stuff to display'}</code>
 * @param {string=} options.messageSummary - an optional custom error message summarizing the 
 * error. When not present, the default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.restriction.date.messageSummary</code>.
 * Tokens: {value} - value entered by user<p>. 
 * Example:<br/>
 * "Value {value} is disabled."<br/>
 * <p>
 * @param {string=} options.messageDetail - a custom error message used for creating detail part 
 * of message. When not present, the default message detail is the 
 * resource defined with the key <code class="prettyprint">oj-validator.restriction.date.messageDetail</code>.
 * Tokens: {value} - value entered by user<p>. 
 * Example:<br/>
 * "Value {value} is a disabled entry. Please select a different date."<br/>
 * </p>
 * @export
 * @constructor
 * @since 0.6
 */
oj.DateRestrictionValidator = function _DateRestrictionValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateRestrictionValidator, oj.Validator, "oj.DateRestrictionValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 */
oj.DateRestrictionValidator.prototype.Init = function (options)
{
  oj.DateRestrictionValidator.superclass.Init.call(this);
  this._dayFormatter = options["dayFormatter"];
  this._converter = oj.IntlConverterUtils.getConverterInstance(options["converter"]);
  if (options)
  {
    this._messageSummary = options['messageSummary'] || null;
    this._messageDetail = options['messageDetail'] || null;
  }
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @private
 * @ignore
 * @param {Object|string} valueDateParam that is being validated. Note it is set to string as well to keep gc happy
 * @returns {boolean} boolean of whether it is a disabled date
 */
oj.DateRestrictionValidator.prototype._inDisabled = function(valueDateParam) 
{
  var dayFormatter = this._dayFormatter;
  
  if(dayFormatter) {
    var fullYear = valueDateParam["fullYear"],
        month = valueDateParam["month"] + 1, //request to start from 1 rather than 0
        date = valueDateParam["date"],
        metaData = dayFormatter({"fullYear": fullYear, "month": month, "date": date});
    
    return metaData && metaData.disabled;
  }
  
  return false;
};

/**
 * Validates whether the date provided is part of disabled date
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when there is no match
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 */
oj.DateRestrictionValidator.prototype.validate = function (value)
{
  var summary = "", 
      detail = "", 
      translations = oj.Translations, 
      messageSummary = this._messageSummary,
      messageDetail = this._messageDetail,
      valueStr = value ? this._converter['format'](value) : value,
      valueDateParam = value ? oj.IntlConverterUtils._dateTime(value, ["fullYear", "month", "date"], 
                        true) : null;
  
  if(value === null) 
  {
    return value;
  }
  
  if(this._inDisabled(valueDateParam)) {
    
    summary = messageSummary ? translations.applyParameters(messageSummary, {"value": valueStr}) : 
                translations.getTranslatedString('oj-validator.restriction.date.messageSummary', {"value": valueStr});
    detail = messageDetail ? translations.applyParameters(messageDetail, {"value": valueStr}) : 
                translations.getTranslatedString('oj-validator.restriction.date.messageDetail', {"value": valueStr});
    throw new oj.ValidatorError(summary, detail);
  }
  
  return value;
};

/**
 * A message to be used as hint. As there exists no hint for DateRestrictionValidator, default is to return null.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.DateRestrictionValidator
 * @instance
 * @export
 */
oj.DateRestrictionValidator.prototype.getHint = function ()
{
  return null;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */
 
/**
 * Constructs a DateTimeRangeValidator that ensures the value provided is within a given range
 * @param {Object=} options an object literal used to provide the following properties
 * @param {string=} options.min - the minimum datetime value of the entered value. Should be ISOString.
 * @param {string=} options.max - the maximum datetime value of the entered value. Should be ISOString.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * @param {string=} options.hint.max - a hint used to indicate the allowed maximum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a datetime less than or equal to {max}
 * @param {string=} options.hint.min - a hint used to indicate the allowed minimum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a datetime greater than or equal to {min}
 * @param {string=} options.hint.inRange - a hint used to indicate the allowed range. When not 
 * present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a datetime between {min} and {max}
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * @param {string=} options.messageDetail.rangeUnderflow - the detail error message to be used when 
 * input value is less than the set minimum value. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * Entered {value} with min being {min}
 * @param {string=} options.messageDetail.rangeOverflow - the detail error message to be used when 
 * input value exceeds the maximum value set.  When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messagedetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * Entered {value} with max being {max}
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.rangeUnderflow - the summary of the error message when 
 * input value is less than the set minimum value. When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeUnderflow</code>.
 * @param {string=} options.messageSummary.rangeOverflow - the summary of the error message when 
 * input value exceeds the maximum value set.  When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.datetime.messageSummary.rangeOverflow</code>.
 * @export
 * @constructor
 * @since 0.6
*/
oj.DateTimeRangeValidator = function _DateTimeRangeValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.DateTimeRangeValidator, oj.Validator, "oj.DateTimeRangeValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.Init = function (options)
{
  oj.DateTimeRangeValidator.superclass.Init.call(this);

  //if undefined set to null as they are equivalent in terms of logic
  //setting to null for the default validator [min + max option] is taken care of for ojInputDate 
  //in _InitOptions for min + max values [default validator]; however 
  //user can pass in the validators via validators option so taking care of it here
  this._converter = oj.IntlConverterUtils.getConverterInstance(options["converter"]);
  this._min = options["min"] || null;
  this._max = options["max"] || null;
  
  if (options)
  {
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when there is no match
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.validate = function (value)
{
  var customMessageSummary = this._customMessageSummary,
      customMessageDetail = this._customMessageDetail,
      messageDetailRangeOverflow = customMessageDetail["rangeOverflow"], 
      messageDetailRangeUnderflow = customMessageDetail["rangeUnderflow"], 
      messageSummaryRangeOverflow = customMessageSummary["rangeOverflow"],
      messageSummaryRangeUnderflow = customMessageSummary["rangeUnderflow"],
      converterUtils = oj.IntlConverterUtils,
      min = this._min, 
      max = this._max, 
      summary = "", 
      detail = "", 
      translations = oj.Translations, 
      params = null,
      valStr = value ? this._converter['format'](value) : value,
      minStr,
      maxStr;
  
  if(value === null) 
  {
    // request to not throw an error when value being passed is of null
    return value;
  }
  
  valStr = this._converter['format'](value);
  
  if(min) 
  {
    min = converterUtils._minMaxIsoString(min, value);
    minStr = this._converter ? this._converter['format'](min) : min;
  }
  
  if(max)
  {
    max = converterUtils._minMaxIsoString(max, value);
    maxStr = this._converter ? this._converter['format'](max) : max;
  }
  
  if (min !== null && max !== null)
  {
    //range
    if ((this._converter.compareISODates(value, min) >= 0 && this._converter.compareISODates(value, max) <= 0) || 
        this._converter.compareISODates(min, max) > 0)
    {
      return value;
    }
  }
  else 
  {
    //only min
    if (min !== null)
    {
      if (this._converter.compareISODates(value, min) >= 0)
      {
        return value;
      }
	  
    }
    //max only
    else 
    {
      if (max === null || this._converter.compareISODates(value, max) <= 0)
      {
        return value;
      }
      
    }
  }
  
  if (max !== null && this._converter.compareISODates(value, max) > 0)
  {
      params = {"value": valStr, "max": maxStr};
      summary = messageSummaryRangeOverflow ? messageSummaryRangeOverflow : 
        translations.getTranslatedString('oj-validator.range.datetime.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ? 
        translations.applyParameters(messageDetailRangeOverflow, params) : 
        translations.getTranslatedString('oj-validator.range.datetime.messageDetail.rangeOverflow', 
        params);
  }
  else if (min !== null && this._converter.compareISODates(value, min) < 0)
  {
      params = {"value": valStr, "min": minStr};
      summary = messageSummaryRangeUnderflow ? messageSummaryRangeUnderflow : 
        translations.getTranslatedString('oj-validator.range.datetime.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ?
        translations.applyParameters(messageDetailRangeUnderflow, params) : 
        translations.getTranslatedString('oj-validator.range.datetime.messageDetail.rangeUnderflow', 
        params);   
  }

  throw new oj.ValidatorError(summary, detail);
};

/**
 * A message to be used as hint.
 *
 * @returns {string|null} a hint message or null if no hint is available in the options
 * @memberof oj.DateTimeRangeValidator
 * @instance
 * @export
 */
oj.DateTimeRangeValidator.prototype.getHint = function ()
{
  var hint = null, hints = this._hint, 
      hintInRange = hints["inRange"], hintMinimum = hints["min"], 
      hintMaximum = hints["max"],
      min = this._min, 
      max = this._max, 
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max,
      params = null,
      translations = oj.Translations;
  
  if (min !== null && max !== null) 
  {
    params = {"min": minStr, "max": maxStr};
    hint = hintInRange ? translations.applyParameters(hintInRange, params) : 
            translations.getTranslatedString('oj-validator.range.datetime.hint.inRange', params);
  }
  else if (min !== null)
  {
    params = {"min": minStr};
    hint = hintMinimum ?  translations.applyParameters(hintMinimum, params) :
            translations.getTranslatedString('oj-validator.range.datetime.hint.min', params);
  }
  else if (max !== null)
  {
    params = {"max": maxStr};
    hint = hintMaximum ?  translations.applyParameters(hintMaximum, params) :
            translations.getTranslatedString('oj-validator.range.datetime.hint.max', params);
  }

  return hint;
};
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates. 
 * All rights reserved.
 */

/**
 * A factory implementation to create the built-in number converter of type 
 * {@link oj.IntlNumberConverter}. 
 * 
 * @name oj.NumberConverterFactory
 * @class
 * 
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var ncf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER); 
 * var salaryOptions = {currency: "EUR" , pattern: "¤#,##0.00;(¤#,##0.00)"};
 * var salaryConverter = ncf.createConverter(salaryOptions);
 * @public
 * @since 0.6
 * 
 */
oj.NumberConverterFactory = (function () 
{
  
  function _createNumberConverter(options) 
  {
    return new oj.IntlNumberConverter(options);
  }
  
  return {
    /**
     * Creates an immutable (jet) number converter instance.
     * 
     * @param {Object=} options an object literal used to provide optional information to initialize 
     * the jet number converter with. For details on what to pass for options, refer to 
     * {@link oj.IntlNumberConverter}
     * 
     * @return {oj.IntlNumberConverter}
     * @memberOf oj.NumberConverterFactory
     * @public
     */
    'createConverter': function(options) {
      return _createNumberConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER, // factory name
                               oj.NumberConverterFactory);


/**
 * A factory implementation to create the built-in datetime converter of type 
 * {@link oj.IntlDateTimeConverter}. 
 * 
 * @name oj.DateTimeConverterFactory
 * @public
 * @class
 * @example <caption>create an instance of the jet datetime converter using the options provided</caption>
 * var dtcf = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);  
 * var dateOptions = {year: '2-digit', month: 'numeric', day: 'numeric'};
 * var dateConverter = dtcf.createConverter(dateOptions);
 * @since 0.6
 * 
 */
oj.DateTimeConverterFactory = (function () 
{
  function _createDateTimeConverter(options) 
  {
    return new oj.IntlDateTimeConverter(options);
  }
  
  /**
   * 
   * @public
   */
  return {
    /**
     * Creates an immutable (jet) datetime converter instance. 
     * 
     * @param {Object=} options an object literal used to provide an optional information to 
     * initialize the jet datetime converter. For details on what to pass for options, refer to 
     * @link oj.IntlDateTimeConverter.
     * 
     * @return {oj.IntlDateTimeConverter} 
     * @memberOf oj.DateTimeConverterFactory
     * @public
     */
    'createConverter' : function(options) {
      return _createDateTimeConverter(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultConverterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME, // factory name
                               oj.DateTimeConverterFactory);


// JET VALIDATOR FACTORIES 

/**
 * A factory implementation to create an instance of the built-in required validator of type 
 * {@link oj.RequiredValidator}. 
 * 
 * @example <caption>create an instance of the required validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED); 
 * var options = {'hint' : 'a value is required for this field'};
 * var requiredValidator = rvf.createValidator(options);
 * 
 * @name oj.RequiredValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RequiredValidatorFactory = (function () 
{
  
  function _createRequiredValidator(options) 
  {
    return new oj.RequiredValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type @link oj.RequiredValidator that ensures that 
     * the value provided is not empty.  
     * 
     * @param {Object=} options an object literal used to provide an optional hint and error 
     * message. See {@link oj.RequiredValidator} for details.<p>
     * 
     * @return {oj.RequiredValidator}
     * @memberOf oj.RequiredValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRequiredValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REQUIRED,
                                                oj.RequiredValidatorFactory);
                               
/**
 * A factory implementation that creates an instance of the built-in regExp validator of type 
 * {@link oj.RegExpValidator}.
 * 
 * @example <caption>create an instance of the regExp validator using the factory</caption>
 * var rvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP);  
 * var usernameValidator = rvf.createValidator(
 *  {
 *    'pattern': '[a-zA-Z0-9]{3,}', 
 *    'messageDetail': 'You must enter at least 3 letters or numbers'}
 *  });
 * 
 * @name oj.RegExpValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.RegExpValidatorFactory = (function () 
{
  
  function _createRegExpValidator(options) 
  {
    return new oj.RegExpValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type {@link oj.RegExpValidator} that ensures the value 
     * matches the provided pattern. 
     * 
     * @param {Object} options an object literal used to provide the pattern, an optional hint, error 
     * message among others. See {@link oj.RegExpValidator} for details.<p>
     * 
     * 
     * @return {oj.RegExpValidator} 
     * @memberOf oj.RegExpValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createRegExpValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_REGEXP,
                                                oj.RegExpValidatorFactory);
                                        
/**
 * a factory implementation to create an instance of the built-in dateTimeRange validator of type 
 * {@link oj.DateTimeRangeValidator}. 
 * 
 * @example <caption>create an instance of the dateTimeRange validator using the factory</caption>
 * var drvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE);  
 * var birthdateOptions = {min: new Date(1930, 00, 01), max: new Date(1995, 11,31)};
 * var birthdateValidator = drvf.createValidator(birthdateOptions);
 *  
 * @name oj.DateTimeRangeValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.DateTimeRangeValidatorFactory = (function () 
{
  
  function _createDateTimeRangeValidator(options) 
  {
    return new oj.DateTimeRangeValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type {@link oj.DateTimeRangeValidator} that ensures 
     * that the (datetime) value provided is within a given range.
     * 
     * @param {Object=} options an object literal used to provide the minimum, maximum and other 
     * optional values. See {@link oj.DateTimeRangeValidator} for details.<p>
     * 
     * @return {oj.DateTimeRangeValidator}
     * @memberOf oj.DateTimeRangeValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createDateTimeRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATETIMERANGE,
                                                oj.DateTimeRangeValidatorFactory);
												
/**
 * a factory method to create an instance of the built-in dateRestriction validator of type 
 * {@link oj.DateRestrictionValidator}. 
 * 
 * @example <caption>create an instance of the dateRestriction validator using the factory </caption>
 * var drvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION);
 * var drValidator = drvf.createValidator();
 *  
 * @name oj.DateRestrictionValidatorFactory
 * @class
 * @since 0.6
 * @public
 * 
 */
oj.DateRestrictionValidatorFactory = (function () 
{
  
  function _createDateRestrictionValidator(options) 
  {
    return new oj.DateRestrictionValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type oj.DateRestrictionValidator that ensures that the 
     * isoString value provided is not in a disabled entry of dayFormatter callback.
     * 
     * @param {Object=} options an object literal
     * See {@link oj.ojInputDate} and {@link oj.DateRestrictionValidator} for details.<p>
     * 
     * @return {oj.DateRestrictionValidator}
     * @memberOf oj.DateRestrictionValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createDateRestrictionValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_DATERESTRICTION,
                                                oj.DateRestrictionValidatorFactory);
                                        
/**
 * a factory method to create an instance of a built-in numberRange validator of type 
 * {@link oj.NumberRangeValidator}. 
 * 
 * @example <caption>create an instance of the numberRange validator using the factory</caption>
 * var lrvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBER_RANGE);
 * var options = {hint: {min: 'Enter a value greater than {min}'}, min: 100};
 * var lrValidator = lrvf.createValidator(options);
 * 
 * @name oj.NumberRangeValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.NumberRangeValidatorFactory = (function () 
{
  
  function _createNumberRangeValidator(options) 
  {
    return new oj.NumberRangeValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type {@link oj.NumberRangeValidator} that ensures 
     * that the value provided is within a given range.
     * 
     * @param {Object=} options an object literal used to provide the minimum, maximum and other 
     * optional values. See {@link oj.NumberRangeValidator} for details.<p>
     * 
     * @return {oj.NumberRangeValidator}
     * @memberOf oj.NumberRangeValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createNumberRangeValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_NUMBERRANGE,
                                                oj.NumberRangeValidatorFactory);
                                        
/**
 * Returns an instance of oj.LengthValidatorFactory that provides a factory method to create an 
 * instance of a length validator. 
 * 
 * @example <caption>create an instance of the length validator using the factory</caption>
 * var lvf = oj.Validation.validatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH);
 * var options = {hint: {max: 'Enter {max} or fewer characters'}, max: 10};
 * var lValidator = lvf.createValidator(options);
 * 
 * @name oj.LengthValidatorFactory
 * @class
 * @public
 * @since 0.6
 * 
 */
oj.LengthValidatorFactory = (function () 
{
  
  function _createLengthValidator(options) 
  {
    return new oj.LengthValidator(options);
  }
  
  return {
    /**
     * Creates an immutable validator instance of type oj.LengthValidator that ensures that the 
     * value provided is withing a given length.
     * 
     * @param {Object=} options an object literal used to provide the 'minimum', 'maximum' and other 
     * optional values. See {@link oj.LengthValidator} for details.<p>
     * 
     * @return {oj.LengthValidator}
     * @memberOf oj.LengthValidatorFactory
     * @public
     */
    'createValidator': function(options) {
      return _createLengthValidator(options);
    }
  };
}()); // notice immediate invocation of anonymous function

/** Register the default factory provider function */
oj.Validation.__registerDefaultValidatorFactory(oj.ValidatorFactory.VALIDATOR_TYPE_LENGTH,
                                                oj.LengthValidatorFactory);
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*
 DESCRIPTION
 OraI18nUtils provides helper functions for converter objects.
 
 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>
 
 NOTES
 <other useful comments, qualifications, etc.>
 
 MODIFIED    (MM/DD/YY)
        05/13/14 - Creation
 */

/**
 * @ignore
 */
var OraI18nUtils = {};
//supported numbering systems
OraI18nUtils.numeringSystems = {
  'latn': "\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039",
  'arab': "\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669",
  'thai': "\u0e50\u0e51\u0e52\u0e53\u0e54\u0e55\u0e56\u0e57\u0e58\u0e59"
};

OraI18nUtils.regexTrim = /^\s+|\s+$|\u200f|\u200e/g;
OraI18nUtils.regexTrimNumber = /\s+|\u200f|\u200e/g;
OraI18nUtils.regexTrimRightZeros = /0+$/g;
OraI18nUtils.zeros = ["0", "00", "000"];
//ISO 8601 string accepted values:
//date only: YYYY or YYYY-MM or YYYY-MM-dd or YYYYMM or YYYYMMdd
//time only without timezone: Thh:mm or Thh:mm:ss or Thh:mm:ss.SSS or Thhmm or Thhmmss or Thhmmss.SSS
//time only with timezone: any of the time values above followed by any of the following: Z or +/-hh:mm or extended timezone like @America/Los_Angeles
//date time: any of the date values followed by any of the time values
OraI18nUtils._ISO_DATE_REGEXP = /^\d{4}(?:-?\d{2}(?:-?\d{2})?)?(?:T\d{2}:?\d{2}(?::?\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?)?$|^T\d{2}:?\d{2}(?::?\d{2}(?:\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/;

/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]hh:mm syntax.
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 * Examples:
 * 1- The local time is UTC-7 (Pacific Daylight Time):
 * OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT+07:00" 
 * 2- The local time is UTC+1 (Central European Standard Time):
 * OraI18nUtils. getLocalTimeZoneOffset() will return the string "Etc/GMT-01:00"  
 * @returns {string}  
 */
OraI18nUtils.getLocalTimeZoneOffset = function () {
  var d = new Date();
  var offset = d.getTimezoneOffset();
  return OraI18nUtils.getTimeStringFromOffset("Etc/GMT", offset, false, false);
};


/*
 * Will return timezone if it exists.
 */
OraI18nUtils._getTimeZone = function (isoString)
{
  if (!isoString || typeof isoString !== "string")
  {
    return null;
  }
  var match = OraI18nUtils._ISO_DATE_REGEXP.exec(isoString);
  //make sure it is iso string
  if (match === null)
  {
    OraI18nUtils._throwInvalidISOString(isoString);
  }
  if (match[1] !== undefined)
    return match[1];
  return null;
};

/*
 * Will return local isoString provided a date.
 */
OraI18nUtils.dateToLocalIso = function (date)
{
  var isoStr = OraI18nUtils.padZeros(date.getFullYear(), 4) + "-" + OraI18nUtils.padZeros((date.getMonth() + 1), 2) + "-" + OraI18nUtils.padZeros(date.getDate(), 2) + "T" +
      OraI18nUtils.padZeros((date.getHours()), 2) + ":" + OraI18nUtils.padZeros((date.getMinutes()), 2) + ":" +
      OraI18nUtils.padZeros((date.getSeconds()), 2);
  if (date.getMilliseconds() > 0) {
    isoStr += "." + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(date.getMilliseconds(), 3));
  }
  return isoStr;
};

OraI18nUtils.partsToIsoString = function (parts)
{
  var isoStr = OraI18nUtils.padZeros(parts[0], 4) + "-" + OraI18nUtils.padZeros(parts[1], 2) + "-" + OraI18nUtils.padZeros(parts[2], 2) + "T" +
      OraI18nUtils.padZeros(parts[3], 2) + ":" + OraI18nUtils.padZeros(parts[4], 2) + ":" + OraI18nUtils.padZeros(parts[5], 2);
  if (parts[6] > 0) {
    isoStr += "." + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(parts[6], 3));
  }
  return isoStr;
};

OraI18nUtils.isoToLocalDate = function (isoString)
{
  if (!isoString || typeof isoString !== "string")
  {
    return null;
  }
  return this._isoToLocalDateIgnoreTimezone(isoString);
};

OraI18nUtils._isoToLocalDateIgnoreTimezone = function (isoString) {
  var datetime = OraI18nUtils._IsoStrParts(isoString);
  return new Date(datetime[0], datetime[1] - 1, datetime[2], datetime[3], datetime[4], datetime[5], datetime[6]);
};

OraI18nUtils._IsoStrParts = function (isoString) {
  var splitted = isoString.split("T"),
      tIndex = isoString.indexOf("T"),
      today = new Date(), i,
      datetime = [today.getFullYear(), today.getMonth() + 1, today.getDate(), 0, 0, 0, 0];

  if (splitted[0] !== "")
  {
    //contains date portion
    var dateSplitted = splitted[0].split("-");
    for (i = 0; i < dateSplitted.length; i++) {
      datetime[i] = parseInt(dateSplitted[i], 10);
    }
  }

  if (tIndex !== -1) {
    var milliSecSplitted = splitted[1].split("."), //contain millseconds
        timeSplitted = milliSecSplitted[0].split(":"); //contain hours, minutes, seconds

    for (i = 0; i < timeSplitted.length; i++)
    {
      datetime[3 + i] = parseInt(timeSplitted[i], 10);
    }

    if (milliSecSplitted.length === 2 && milliSecSplitted[1])
    {
      datetime[6] = parseInt(OraI18nUtils.zeroPad(milliSecSplitted[1], 3, false), 10);
    }
  }
  return datetime;
};

OraI18nUtils.getISOStrFormatInfo = function (isoStr) {
  var res = {
    'format': null,
    'dateTime': null,
    'timeZone': "",
    'isoStrParts': null
  };
  var exe = OraI18nUtils._ISO_DATE_REGEXP.exec(isoStr);
  if (exe === null) {
    OraI18nUtils._throwInvalidISOString(isoStr);
  }
  if (exe[1] === undefined && exe[2] === undefined) {
    res['format'] = 'local';
    res['dateTime'] = isoStr;
    res['isoStrParts'] = OraI18nUtils._IsoStrParts(res['dateTime']);
    return res;
  }
  res['timeZone'] = (exe[1] !== undefined) ? exe[1] : exe[2];
  if (res['timeZone'] === 'Z')
    res['format'] = 'zulu';
  else
    res['format'] = 'offset';
  res['dateTime'] = isoStr.substring(0, isoStr.indexOf(res['timeZone']));
  res['isoStrParts'] = OraI18nUtils._IsoStrParts(res['dateTime']);
  return res;
};

OraI18nUtils._throwTimeZoneNotSupported = function () {
  var msg, error, errorInfo;
  msg = "time zone is not supported";
  error = new Error(msg);
  errorInfo = {
    'errorCode': 'timeZoneNotSupported'
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

OraI18nUtils._throwInvalidISOString = function (str) {
  var msg, error, errorInfo;
  msg = "The string " + str + " is not a valid ISO 8601 string.";
  error = new Error(msg);
  errorInfo = {
    'errorCode': 'invalidISOString',
    'parameterMap': {
      'isoStr': str
    }
  };
  error['errorInfo'] = errorInfo;
  throw error;
};

OraI18nUtils.trim = function (value) {
  return (value + "").replace(OraI18nUtils.regexTrim, "");
};

OraI18nUtils.trimRightZeros = function (value) {
  return (value + "").replace(OraI18nUtils.regexTrimRightZeros, "");
};


OraI18nUtils.trimNumber = function (value) {
  var s = (value + "").replace(OraI18nUtils.regexTrimNumber, "");
  return s;
};

OraI18nUtils.startsWith = function (value, pattern) {
  return value.indexOf(pattern) === 0;
};

OraI18nUtils.toUpper = function (value) {
  // "he-IL" has non-breaking space in weekday names.
  return value.split("\u00A0").join(" ").toUpperCase();
};

OraI18nUtils.padZeros = function (num, c) {
  var r, s = num + "";
  if (c > 1 && s.length < c) {
    r = (OraI18nUtils.zeros[c - 2] + s);
    return r.substr(r.length - c, c);
  }
  else {
    r = s;
  }
  return r;
};

OraI18nUtils.zeroPad = function (str, count, left) {
  str = "" + str;
  var l;
  for (l = str.length; l < count; l += 1) {
    str = (left ? ("0" + str) : (str + "0"));
  }
  return str;
};

OraI18nUtils.getTimeStringFromOffset = function (prefix, offset, reverseSign, alwaysMinutes) {
  var isNegative = reverseSign ? offset >= 0 : offset < 0;
  offset = Math.abs(offset);
  var hours = (offset / 60) << 0;
  var minutes = offset % 60;
  var sign = isNegative ? "-" : "+";
  if (alwaysMinutes) {
    hours = OraI18nUtils.zeroPad(hours, 2, true);
  }
  var str = prefix + sign + hours;
  if (minutes > 0 || alwaysMinutes) {
    str += ":" + OraI18nUtils.zeroPad(minutes, 2, true);
  }
  return str;
};

//get the numbering system key from the locale's unicode extension.
//Verify that the locale data has a numbers entry for it, if not return latn as default.
OraI18nUtils.getNumberingSystemKey = function (localeElements, locale) {
  if (locale === undefined)
    return 'latn';
  var numberingSystemKey = OraI18nUtils.getNumberingExtension(locale);
  var symbols = "symbols-numberSystem-" + numberingSystemKey;
  if (localeElements['numbers'][symbols] === undefined)
    numberingSystemKey = 'latn';
  return numberingSystemKey;
};

//return the language part
OraI18nUtils.getBCP47Lang = function (tag) {
  var arr = tag.split("-");
  return arr[0];
};

//return the region part. tag is lang or lang-region or lang-script or
//lang-script-region
OraI18nUtils.getBCP47Region = function (tag) {
  var arr = tag.split("-");
  if (arr.length === 3)
    return arr[2];
  if (arr.length === 2) {
    if (arr[1].length === 2)
      return arr[1];
  }
  return '001';
};


//get the unicode numbering system extension.
OraI18nUtils.getNumberingExtension = function (locale) {
  locale = locale || "en-US";
  var idx = locale.indexOf("-u-nu-");
  var numbering = 'latn';
  if (idx !== -1) {
    numbering = locale.substr(idx + 6, 4);
  }
  return numbering;
};

OraI18nUtils.haveSamePropertiesLength = function (obj) {
  var count = 0;
  for (var n in obj)
  {
    count++;
  }
  return count;
};

//cldr locale data start with "main" node.
//return the subnode under main.
OraI18nUtils.getLocaleElementsMainNode = function (bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return mainNode[subnode];
};

//get the locale which is a subnode of "main".
OraI18nUtils.getLocaleElementsMainNodeKey = function (bundle) {
  var mainNode = bundle['main'];
  var subnode;
  for (var n in mainNode)
  {
    subnode = n;
    break;
  }
  return subnode;
};

OraI18nUtils._toBoolean = function (value) {
  if (typeof value === "string") {
    var s = value.toLowerCase().trim();
    switch (s) {
      case "true":
      case "1":
        return true;
      case "false":
      case "0":
        return false;
      default:
        return value;
    }
  }
  return value;
};
//Return a function getOption.
//The getOption function extracts the value of the property named 
//property from the provided options object, converts it to the required type,
// checks whether it is one of a List of allowed values, and fills in a 
// fallback value if necessary.
OraI18nUtils.getGetOption = function (options, getOptionCaller) {
  if (options === undefined) {
    throw new Error('Internal ' + getOptionCaller +
        ' error. Default options missing.');
  }

  var getOption = function getOption(property, type, values, defaultValue) {
    if (options[property] !== undefined) {
      var value = options[property];
      switch (type) {
        case 'boolean':
          value = OraI18nUtils._toBoolean(value);
          break;
        case 'string':
          value = String(value);
          break;
        case 'number':
          value = Number(value);
          break;
        default:
          throw new Error('Internal error. Wrong value type.');
      }
      if (values !== undefined && values.indexOf(value) === -1) {
        var expectedValues = [];
        for (var i = 0; i < values.length; i++) {
          expectedValues.push(values[i]);
        }
        var msg = "The value '" + options[property] +
            "' is out of range for '" + getOptionCaller +
            "' options property '" + property + "'. Valid values: " +
            expectedValues;
        var rangeError = new RangeError(msg);
        var errorInfo = {
          'errorCode': 'optionOutOfRange',
          'parameterMap': {
            'propertyName': property,
            'propertyValue': options[property],
            'propertyValueValid': expectedValues,
            'caller': getOptionCaller
          }
        };
        rangeError['errorInfo'] = errorInfo;
        throw rangeError;
      }

      return value;
    }
    return defaultValue;
  };

  return getOption;
};

/**
 * matches a string to a reference string and returns the start and end indexes
 * of the match in the referensed string. The locale and options arguments let 
 * applications specify the language whose sort order should be used and customize 
 * the behavior of the function.
 * 
 * @param {string} str the reference string 
 * @param {string} pat The string against which the reference string is compared
 * @param {string} locale a BCP 47 language tag
 * @param {Object=} options Optional. An object with the following property:
 * sensitivity: 
 *   Which differences in the strings should lead to non-zero result values. Possible values are:
 *   "base": Only strings that differ in base letters compare as unequal. Examples: a ? b,  a = A.
 *   "accent": Only strings that differ in base letters or accents and other diacritic marks compare as unequal. Examples: a ? b, , a = A.
 *   "case": Only strings that differ in base letters or case compare as unequal. Examples: a ? b, a ? A.
 *   "variant": Strings that differ in base letters, accents and other diacritic marks, or case compare as unequal. 
 *   The default is base.
 * @return {Array|null} an array containing the start and end indexes of the match or null if there is no match.
 */
OraI18nUtils.matchString = function (str, pat, locale, options) {
  if (options === undefined) {
    options = {sensitivity: 'base', usage: 'sort'};
  }
  var getOption = OraI18nUtils.getGetOption(options, "OraI18nUtils.matchString");
  options['usage'] = getOption('usage', 'string', ['sort', 'search'], 'sort');
  options['sensitivity'] = getOption('sensitivity', 'string', ['base', 'accent', 'case', 'variant'], 'base');
  var i, j;
  var len = str.length;
  var patLen = pat.length - 1;
  for (i = 0; i < len; i++) {
    for (j = 0; j < 3; j++) {
      var len2 = len - i;
      len2 = Math.min(len2, patLen + j);
      var str2 = str.substr(i, len2);
      var res = str2.localeCompare(pat, locale, options);
      if (res === 0) {
        var end = i + len2 - 1;
        var ret = [i, end];
        return ret;
      }
    }
  }
  return null;
};

var _DEFAULT_TIME_PORTION = "T00:00:00.000";
var _DATE_TIME_KEYS = {"fullYear": {pos: 0, pad: 4}, "month": {pos: 1, pad: 2}, "date": {pos: 2, pad: 2},
  "hours": {pos: 3, pad: 2}, "minutes": {pos: 4, pad: 2}, "seconds": {pos: 5, pad: 2},
  "milliseconds": {pos: 6, pad: 3}, "timeZone": {pos: 7}};

/**
 * Parses the isoString and returns a JavaScript Date object
 * 
 * @expose
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 */
OraI18nUtils.isoToDate = function (isoString)
{
  //note new Date w/ isoString in IE fails so need to use parsing from momentjs support
  return new Date(this._normalizeIsoString(isoString));
};

/**
 * Will return an updated toIsoString using the timePortion from the fromIsoString or from the default 
 * OraI18nUtils.DEFAULT_TIME_PORTION
 * 
 * @private
 * @expose
 * @param {string} fromIsoString isoString that may not be a complete isoString
 * @param {string} toIsoString isoString that may not be a complete isoString
 * @returns {string} modified toIsoString with original date portion and the time portion from the fromIsoString
 * @since 1.1
 */
OraI18nUtils._copyTimeOver = function (fromIsoString, toIsoString)
{
  if (!fromIsoString || !toIsoString)
  {
    throw new Error("Provided invalid arguments");
  }

  //need to only normalize toIsoString, since copying only time from fromIsoString
  toIsoString = this._normalizeIsoString(toIsoString);

  var fromTimeIndex = fromIsoString.indexOf("T"),
      toTimeIndex = toIsoString.indexOf("T"),
      toDatePortion = toIsoString.substring(0, toTimeIndex),
      fromTimePortion = fromTimeIndex !== -1 ? fromIsoString.substring(fromTimeIndex) : _DEFAULT_TIME_PORTION;

  return toDatePortion + fromTimePortion;
};

/**
 * Clears the time portion of the isoString
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 */
OraI18nUtils._clearTime = function (isoString)
{
  return this._dateTime(isoString, {"hours": 0, "minutes": 0, "seconds": 0, "milliseconds": 0});
};

/**
 * Will accept an isoString and perform a get operation or a set operation depending on whether param is an Array 
 * or a JSON 
 * 
 * The keys for the get and set operation are defined in _DATE_TIME_KEYS.
 * 
 * Note the handling of month starting with 0 in Date object and being 1 based in isoString will be handled by the function 
 * with the usage of doParseValue. Meaning when you doParseValue and you are getting the value it will automatically 
 * decrement the value and when you are setting the param it will check if the value is of number and if so will 
 * increment it.
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @param {Array|Object} actionParam if an Array will be a get operation, if a JSON will be a set operation
 * @param {boolean=} doParseValue whether one should parseInt the value during the get request
 * @returns {Object|string} an Object when a get operation and a string when a set operation
 * @since 1.1
 */
OraI18nUtils._dateTime = function (isoString, actionParam, doParseValue)
{
  if (!isoString || !actionParam)
  {
    throw new Error("Invalid argument invocation");
  }

  var pos, value, dtKey,
      retVal = null,
      key = null,
      dateTimeKeys = _DATE_TIME_KEYS,
      oraUtilsPadZero = this.padZeros,
      isoStringNormalized = this._normalizeIsoString(isoString), //note intentionally normalizing 
      captured = /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):?(\d{2})?\.?(\d{3})?(.*)?/.exec(isoStringNormalized);

  if (!captured)
  {
    throw new Error("Unable to capture anything");
  }

  captured = captured.slice(1);

  if (Array.isArray(actionParam))
  {
    retVal = {};

    //means an array so perform a get operation
    for (var i = 0, len = actionParam.length; i < len; i++)
    {
      key = actionParam[i];

      if (key in dateTimeKeys)
      {
        pos = dateTimeKeys[key].pos;
        value = captured[pos];

        if (doParseValue && "timeZone" === key)
        {
          throw new Error("Dude you tried to ask timezone to be parsed");
        }

        if (doParseValue)
        {
          var parsed = parseInt(value, 10);
          retVal[key] = pos === 1 ? parsed - 1 : parsed; //since month is 0 based, though about having a callback but month only special
        }
        else
        {
          retVal[key] = value;
        }

      }
    }
  }
  else if ($.isPlainObject(actionParam))
  {

    for (var keys in actionParam)
    {
      dtKey = dateTimeKeys[keys];
      pos = dtKey.pos;
      value = actionParam[keys];

      //special case for month again, 0 based so check if number and if so increment it
      if (pos === 1 && typeof value === "number")
      {
        value++;
      }
      captured[pos] = dtKey.pad ? oraUtilsPadZero(value, dtKey.pad) : value;
    }
    //"2015-02-02T21:12:30.255Z"
    retVal = captured[0] + "-" + captured[1] + "-" + captured[2] + "T" + captured[3] + ":" + captured[4] + ":" + captured[5] +
        (captured.length > 6 && captured[6] ? ("." + captured[6] + (captured.length === 8 && captured[7] ? captured[7] : "")) : "");
  }

  return retVal;
};

/**
 * So the problem is Jet uses incomplete isoString which causes issues in different browsers. 
 * 
 * For instance for a new Date().toISOString() => 2015-02-02T18:00:37.007Z
 * ojInputDate stores 2015-02-02
 * ojInputTime stores T18:00:37.007Z
 * 
 * yet constructing new Date(val) on above causes different results or errors in different browsers, so 
 * this function is to normalize them. Note it is assumed that the point is creating the Date object from the 
 * normalized isoString. Meaning if both contain only the time portion today's date will appended to it.
 * 
 * Here are the use cases
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} a normalized isoString
 * @since 1.1
 */
OraI18nUtils._normalizeIsoString = function (isoString)
{
  if (!isoString)
  {
    throw new Error("Provided invalid arguments");
  }

  var checkTime = function (timeValue)
  {
    var splitted = timeValue.split(":");
    if (splitted.length > 1)
    {
      return timeValue;
    }
    //need at least hour + minute for proper parsing on browser except IE
    return timeValue + ":00";
  },
      todayIsoString = new Date().toISOString(),
      todayDatePortion = todayIsoString.substring(0, todayIsoString.indexOf("T")),
      timeIndex = isoString.indexOf("T"),
      datePortion = timeIndex === -1 ? isoString : isoString.substring(0, timeIndex),
      timePortion = timeIndex !== -1 ? checkTime(isoString.substring(timeIndex)) : _DEFAULT_TIME_PORTION;

  datePortion = datePortion || todayDatePortion;

  return datePortion + timePortion;
};


////-----------------Utility functions for HOUR, MINUTE, AND PERIOD AS SEPARATE INPUTS --------- //////

/**
 * Determine the order of the time picker wheels
 * 
 * @expose
 * @param {string} format a format string
 * @returns {string} one of the following values: hm, hma, ahm 
 * @since 2.2
 */
OraI18nUtils.formatHM = function (format) {
  // remove stuff between quotes.
  // remove anything that is not h, H, m or a
  format = format.replace(/\'[^']*\'/g, "").replace(/[^hHma]*/g, "");
  // Normalize multiple h or H to a single h, same for mulpiple m's
  format = format.replace(/(h|H)+/, "h").replace(/m+/, "m");
  return format;
};

/**
 * Extract actual hour and minute codes
 * 
 * @expose
 * @param {string} fieldId can be 'h' for hours or 'm' for minutes
 * @param {string} format a format string
 * @returns {string|undefined} hours or minutes codes: h, hh, H, HH, m, mm 
 * @since 2.2
 */
OraI18nUtils.extractHourCode = function (fieldId, format) {
  var matches;
  var code;
  if (fieldId === 'h') {
    matches = format.match(/([hH]+)/);
    code = matches[1];
  }
  else if (fieldId === 'm') {
    matches = format.match(/(m+)/);
    code = matches[1];
  }
  return code;
};

//Formatters that take a numeric values (0-*) and convert it to a string for the current converter's code.

/**
 * Converts a numeric hour value into a string in 12 hour format as 1 or 2 digits
 * 
 * @expose
 * @param {number} value an hour 
 * @returns {string} hour in 12 hour format as 1 or 2 digits 
 * @since 2.2
 */
OraI18nUtils.hFormat = function (value) {
  if (value === 0)
    return "12";
  return "" + value;
};

/**
 * Converts a numeric hour value into a string in 12 hour format as 2 digits
 * 
 * @expose
 * @param {number} value an hour 
 * @returns {string} hour in 12 hour format as 2 digits 
 * @since 2.2
 */
OraI18nUtils.hhFormat = function (value) {
  if (value === 0)
    return "12";
  var val = "0" + value;
  return val.slice(-2);
};

/**
 * Converts a numeric hour value into a string as 1 or 2 digits
 * 
 * @expose
 * @param {number} value an hour 
 * @returns {string} hour in 24 hour format as 1 or 2 digits 
 * @since 2.2
 */
OraI18nUtils.HFormat = function (value) {
  return "" + value;
};

/**
 * Converts a numeric hour value into a string as 2 digits
 * 
 * @expose
 * @param {number} value an hour 
 * @returns {string} hour in 24 hour format as  2 digits 
 * @since 2.2
 */
OraI18nUtils.HHFormat = function (value) {
  var val = "0" + value;
  return val.slice(-2);
};

/**
 * Converts a numeric minute value into a string as 2 digits
 * 
 * @expose
 * @param {number} value  minutes 
 * @returns {string} minutes as  2 digits 
 * @since 2.2
 */
OraI18nUtils.mmFormat = function (value) {
  var val = "0" + value;
  return val.slice(-2);
};

OraI18nUtils.ampmFormat = function (value) {
  return ["AM", "PM"][value];  // TODO - lookup translations
};

OraI18nUtils.FORMAT_MAP = {
  'h': OraI18nUtils.hFormat,
  'hh': OraI18nUtils.hhFormat,
  'H': OraI18nUtils.HFormat,
  'HH': OraI18nUtils.HHFormat,
  'mm': OraI18nUtils.mmFormat
};


//Parsers that convert strings into numeric values based on the converter's format.
// Note that the are just good enough but could use more validation.

/**
 * Converts a string into a number
 * 
 * @expose
 * @param {string} value a string
 * @returns {number} a parsed number from the string if the string is only disgits, -1 otherwise 
 * @since 2.2
 */
OraI18nUtils.numberParser = function (value) {
  if (value.match(/^\d+$/)) {
    return parseInt(value, 10);
  }
  return -1;
};

/**
 * Converts a string hour into a number
 * 
 * @expose
 * @param {string} value a string
 * @returns {number} a numeric value of the hour 
 * @since 2.2
 */
OraI18nUtils.hour12Parser = function (value) {
  if (value.match(/^\d+$/)) {
    var hour = parseInt(value, 10);
    if (hour === 0) {
      hour = -1;
    }
    if (hour === 12) {
      hour = 0;
    }
    return hour;
  }
  return -1;
};

/**
 * Converts am pm symbols into disgits
 * 
 * @expose
 * @param {string} value am pm symbols as string
 * @returns {number} a numeric value 0 for 'a', '1' for p 
 * @since 2.2
 */
OraI18nUtils.ampmParser = function (value) {
  value = value.toLowerCase().charAt(0);
  if (value === "a")
    return 0;
  else if (value === "p")
    return 1;
  else
    return -1;
};

OraI18nUtils.PARSER_MAP = {
  'h': OraI18nUtils.hour12Parser,
  'hh': OraI18nUtils.hour12Parser,
  'H': OraI18nUtils.numberParser,
  'HH': OraI18nUtils.numberParser,
  'mm': OraI18nUtils.numberParser
};

//Methods to convert between ISO time strings and numeric minute values.  (Only minutes are required but perhaps seconds)
/**
 * Converts an iso string into minutes
 * 
 * @expose
 * @param {string} isoString an ISO 8601 string
 * @returns {number} the ISO string converted into minutes 
 * @since 2.2
 */
OraI18nUtils.isoToMinutes = function (isoString) {
  var date = OraI18nUtils.isoToLocalDate(isoString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  return hours * 60 + minutes;
};

/**
 * Converts minutes in ISO 8601 string that consist of hours and minutes
 * 
 * @expose
 * @param {number} minutes 
 * @returns {string} minutes converted into ISO 8601 string that consist of hours and minutes
 * @since 2.2
 */
OraI18nUtils.minutesToIso = function (minutes) {
  minutes = Math.floor(minutes);
  var hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  return "T" + OraI18nUtils.HHFormat(hours) + ":" + OraI18nUtils.mmFormat(minutes);
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*global OraDateTimeConverter:true*/
/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * 
 * @classdesc Constructs an immutable instance and initializes it with the options provided. 
 * <p>
 *  The converter instance uses locale symbols for the locale set on the page (returned by 
 *  {@link oj.Config#getLocale}.
 *  </p>
 * There are several ways to initialize the converter.
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year, 
 * month, day, hour, minute, second, weekday, era, timeZoneName, hour12</li>
 * <li>Using a custom date and/or time format pattern using the 'pattern' property</li>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these 
 * would include the properties formaType, dateFormat, timeFormat.</li>
 * </ul>
 * 
 * <p>
 * The options when specified take precendence in the following order:<br>
 * 1. pattern.<br>
 * 2. ECMA options.<br>
 * 3. formatType/dateFormat/timeFormat.
 * <p>
 * The converter provides great leniency when parsing a user input value to a date in the following 
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the 
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid - 
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16 
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the 
 * date is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d', 
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both date and month are less or equal 
 * to 12, no assumptions are made about the day or month and the value parsed against the exact pattern.</li>
 * <li>Supports auto-correction of value, for the short and long types of weekday and month names. 
 * So they can are used anywhere in the value. E.g., if the expected pattern is E, MMM, d, y, all 
 * these values are acceptable - Tue, Nov 26 2013 or Nov, Tue 2013 26 or 2013 Tue 26 Nov. <br/>
 * NOTE: Lenient parsing of narrow era, weekday or month name is not supported because of ambiguity in 
 * choosing the right value. So we expect for narrow era, weekday or month option that values be 
 * provided either in their short or long forms. E.g., Sat, March 02, 2013.
 * </li>
 * <li>Specifying the weekday is optional. E.g., if the expected pattern is E, MMM, d, y; then 
 * entering Nov 26, 2013, is automatically turned to Tuesday Nov 26, 2013. But entering an invalid 
 * weekday, i.e., if the weekday does not match the date, an exception is thrown.</li>
 * <li>Leniency rules apply equally no matter which option is used - pattern, ECMA options or formatType</li>
 * </ul>
 * 
 * @property {Object=} options - an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @property {string=} options.year - allowed values are "2-digit", "numeric". When no options are 
 * set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the year, padded: 00-99.</td>
 *       <td>2001 => 01, 2016 => 16</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the year depending on the value.</td>
 *       <td>2010, 199</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {number=} options.two-digit-year-start - the 100-year period 2-digit year. 
 * During parsing, two digit years will be placed in the range two-digit-year-start to two-digit-year-start + 100 years. 
 * The default is 1950.
 * <p style='padding-left: 5px;'>
 * Example: if two-digit-year-start is 1950, 10 is parsed as 2010<br/><br/>
 * Example: if two-digit-year-start is 1900, 10 is parsed as 1910
 * </p>
 *
 * @property {string=} options.month - specifies how the month is formatted. Allowed values are 
 * "2-digit", "numeric", "narrow", "short", "long". The last 3 values behave in the same way as for 
 * weekday, indicating the length of the string used. When no options are set the default value of 
 * "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the month, padded: 01-12.</td>
 *       <td>1 => 01, 12 => 12</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the month depending on the value.</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the month.</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the month.</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the month.</td>
 *       <td>January</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.day - specifies how the day is formatted. Allowed values are "2-digit",
 *  "numeric". When no options are set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the day in month, padded: 01-31.</td>
 *       <td>1 => 01, 27 => 27</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 31</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.hour - specifies how the hour is formatted. Allowed values are 
 * "2-digit" or "numeric". The hour is displayed using the 12 or 24 hour clock, depending on the 
 * locale. See 'hour12' for details.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the hour, padded: 01-24 depending on the locale.</td>
 *       <td>1 => 01, 24 => 24</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 24</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.minute - specifies how the minute is formatted. Allowed values are 
 * "2-digit", "numeric". Although allowed values for minute are numeric and 2-digit, minute is always 
 * displayed as 2 digits: 00-59.
 *
 * @property {string=} options.second - specifies whether the second should be displayed as "2-digit" 
 * or "numeric". Although allowed values for second are numeric and 2-digit, second is always displayed 
 * as 2 digits: 00-59.
 *
 * @property {string=} options.millisecond - specifies how the minute is formatted. Allowed 
 * value is "numeric". millisecond is always displayed as 3-digits except the case where only millisecond 
 * is present (hour and minute not specified) in which case we display it as no-padded number, example: .5
 *
 * @property {string=} options.weekday - specifies how the day of the week is formatted. If absent, it 
 * is not included in the date formatting. Allowed values are "narrow", "short", "long" indicating the 
 * length of the string used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the day of week.</td>
 *       <td>M</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the day of week.</td>
 *       <td>Mon</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the day of week.</td>
 *       <td>Monday</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.era - specifies how the era is included in the formatted date. If 
 * absent, it is not included in the date formatting. Allowed values are "narrow", "short", "long".
 * Although allowed values are narrow, short, long, we only display era in abbreviated format: BC, AD.
 *
 * @property {string=} options.timeZoneName - allowed values are "short", "long".
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>short name of the time zone.</td>
 *       <td>short: short name of the time zone: PDT, PST, EST, EDT. Note: Not all locales have 
 *           translations for short time zone names, in this case we display the English short name</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>short name of the time zone.</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.timeZone - The possible values of the timeZone property are valid IANA 
 * timezone IDs. If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>IANA ID</td>
 *       <td>America/Los_Angeles, Europe/Paris</td>
 *     </tr>
 *     <tr>
 *       <td>Offset</td>
 *       <td>Etc/GMT-8. The offset is positive if the local time zone is behind UTC and negative if it is ahead. 
 *           The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14). Which means that Etc/GMT-8 
 *           is equivalent to UTC+08.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.isoStrFormat - specifies in which format the ISO string is returned. 
 * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". 
 * The default format is auto.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>offset</td>
 *       <td>time zone offset from UTC.</td>
 *       <td>2016-01-05T11:30:00-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>zulu</td>
 *       <td>zulu time or UTC time.</td>
 *       <td>2016-01-05T19:30:00Z</td>
 *     </tr>
 *     <tr>
 *       <td>local</td>
 *       <td>local time, does not contain time zone offset.</td>
 *       <td>2016-01-05T19:30:00</td>
 *     </tr>
 *     <tr>
 *       <td>auto</td>
 *       <td>auto means the returned ISO string depends on the input string and options</td>
 *       <td></td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dst - The dst option can be used for time only values in conjunction with offset. 
 * Setting dst to true indicates the time is in DST. By default the time is interpreted as standard time. 
 * The possible values of dst are: "true" or "false". Default is "false".
 * <p style='padding-left: 5px;'>
 * Due to Daylight Saving Time, there is a possibility that a time exists twice If the time falls in the duplicate window 
 * (switching from daylight saving time to standard time). The application can disambiguate the time in the overlapping 
 * period using the dst option. Setting dst to true indicates the time is in DST. By default the time is interpreted as 
 * standard time.<br/><br/>
 * Example: On November 1st, 2105 in US the time between 1 and 2 AM will be repeated. The dst option can indicate the 
 * distinction as follows. Initially the time is in DST, so dst:'true' is specified.<br/>
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset', dst : true};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-07:00
 * <br/><br/>
 * If the user does not pass the dst option, the time will be interpreted as standard time. 
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-08:00
 * <br/><br/>
 * At 2AM, DST will be over and the clock brings back to 1AM. Then the dst option should be false or not specified.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:00:00 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:00:00-08:00
 * </p>
 *
 * @property {boolean=} options.hour12 - specifies what time notation is used for formatting the time. 
 * A true value uses the 12-hour clock and false uses the 24-hour clock (often called military time 
 * in the US). This property is undefined if the hour property is not used when formatting the date.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>true</td>
 *       <td>T13:10  is formatted as “1:10 PM”</td>
 *     </tr>
 *     <tr>
 *       <td>false</td>
 *       <td>T13:10 is formatted as “13:10”</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 * 
 * @property {string=} options.pattern - a localized string pattern, where the the characters used in 
 * pattern conform to Unicode CLDR for date time formats. This will override all other options 
 * when present. <br/>
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a 'pattern' will override the default 
 * locale specific format.
 * NOTE: The supported tokens for timezone are of 'Z', 'VV', and 'X'.<br/><br/>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Letter</th>
 *       <th>Date or Time Component</th>
 *       <th>Examples</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>G, GG, GGG</td>
 *       <td>Era designator</td>
 *       <td>AD</td>
 *     </tr>
 *     <tr>
 *       <td>y</td>
 *       <td>numeric representation of year</td>
 *       <td>1, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>yy</td>
 *       <td>2-digit representation of year</td>
 *       <td>01, 14</td>
 *     </tr>
 *     <tr>
 *       <td>yyyy</td>
 *       <td>4-digit representation of year</td>
 *       <td>0001, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>M</td>
 *       <td>Numeric representation of month in year: (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MM</td>
 *       <td>2-digit representation of month in year: (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MMM</td>
 *       <td>Formatted  name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>MMMM</td>
 *       <td>Formatted  name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>MMMMM</td>
 *       <td>Formatted  name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>LLL</td>
 *       <td>Stand-alone name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>LLLL</td>
 *       <td>Stand-alone name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>LLLLL</td>
 *       <td>Stand-alone name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>d</td>
 *       <td>Numeric representation of  day in month (1-31)</td>
 *       <td>1, 21</td>
 *     </tr>
 *     <tr>
 *       <td>dd</td>
 *       <td>2-digit representation of  day in month (01-31)</td>
 *       <td>01, 21</td>
 *     </tr>
 *     <tr>
 *       <td>E, EE, EEE</td>
 *       <td>Formatted name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>EEEE</td>
 *       <td>Formatted name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>EEEEE</td>
 *       <td>Formatted name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>c, cc, ccc</td>
 *       <td>Stand-alone name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>cccc</td>
 *       <td>Stand-alone name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>ccccc</td>
 *       <td>Stand-alone name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>a</td>
 *       <td>am/pm marker</td>
 *       <td>PM</td>
 *     </tr>
 *     <tr>
 *       <td>H</td>
 *       <td>Numeric hour in day (0-23)</td>
 *       <td>1, 23</td>
 *     </tr>
 *     <tr>
 *       <td>HH</td>
 *       <td>2-digit hour in day (00-23)</td>
 *       <td>01, 23</td>
 *     </tr>
 *     <tr>
 *       <td>h</td>
 *       <td>Numeric  hour in am/pm (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>hh</td>
 *       <td>2-digit hour in day (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>k</td>
 *       <td>Numeric  hour in day (1-24)</td>
 *       <td>1, 24</td>
 *     </tr>
 *     <tr>
 *       <td>kk</td>
 *       <td>2-digit hour in day (1-24)</td>
 *       <td>01, 24</td>
 *     </tr>
 *     <tr>
 *       <td>K</td>
 *       <td>Numeric  hour in am/pm (0-11)</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>KK</td>
 *       <td>2-digit hour in am/pm (0-11)</td>
 *       <td>01, 11</td>
 *     </tr>
 *     <tr>
 *       <td>m, mm</td>
 *       <td>2-digit  minute in hour (00-59)</td>
 *       <td>05, 59</td>
 *     </tr>
 *     <tr>
 *       <td>s, ss</td>
 *       <td>2-digit second in minute (00-59)</td>
 *       <td>01, 59</td>
 *     </tr>
 *     <tr>
 *       <td>S</td>
 *       <td>Numeric  Millisecond (0-999)</td>
 *       <td>1, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SS</td>
 *       <td>2-digit Millisecond (00-999)</td>
 *       <td>01, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SSS</td>
 *       <td>3-digit Millisecond (000-999)</td>
 *       <td>001, 999</td>
 *     </tr>
 *     <tr>
 *       <td>z, zz, zzz</td>
 *       <td>Abbreviated time zone name</td>
 *       <td>PDT, PST</td>
 *     </tr>
 *     <tr>
 *       <td>zzzz</td>
 *       <td>Full time zone name</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time</td>
 *     </tr>
 *     <tr>
 *       <td>Z, ZZ, ZZZ</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>X</td>
 *       <td>Sign hours</td>
 *       <td>-08</td>
 *     </tr>
 *     <tr>
 *       <td>XX</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>XXX</td>
 *       <td>Sign hours:minutes</td>
 *       <td>-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>VV</td>
 *       <td>Time zone ID</td>
 *       <td>Americs/Los_Angeles</td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * @property {string=} options.formatType - determines the 'standard' date and/or time format lengths 
 * to use. Allowed values: "date", "time", "datetime". See 'dateFormat' and 'timeFormat' options. 
 * When set a value must be specified.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>datetime</td>
 *       <td>date and time portions are displayed.</td>
 *       <td>“September 20, 2015 12:04 PM”, “September 20, 2015 12:05:35 PM Pacific Daylight Time”</td>
 *     </tr>
 *     <tr>
 *       <td>date</td>
 *       <td>date portion only is displayed.</td>
 *       <td>“September 20, 2015”</td>
 *     </tr>
 *     <tr>
 *       <td>time</td>
 *       <td>time portion only is displayed.</td>
 *       <td>“12:05:35”</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dateFormat - specifies the standard date format length to use when 
 * formatType is set to "date" or "datetime". Allowed values are : "short" (default), "medium", "long", 
 * "full". 
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>9/20/15</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>Sep 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>September 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>Sunday, September 20, 2015</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.timeFormat - specifies the standard time format length to use when 
 * 'formatType' is set to "time" or "datetime". Allowed values: "short" (default), "medium", "long", 
 * "full". 
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>12:11 PM</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>12:11:23 PM</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>12:12:19 PM PDT</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>12:12:37 PM Pacific Daylight Time</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 * 
 * @example <caption>Create a date time converter using no options. This uses the default value for 
 * year, month, day properties</caption>
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter();
 * var resolved = converter.resolvedOpions();
 * // logs "day=numeric, month=numeric, year=numeric"
 * console.log("day=" + resolved.day + ", month=" + resolved.month + ", year=" + resolved.year);
 * <br/>
 * 
 * @example <caption>Create a date time converter using the ECMA options to represent date</caption>
 * var options = { year:'2-digit', month: '2-digit', day: '2-digit'};
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>Create a date time converter using the 'pattern' option</caption>
 * var options = {pattern: 'MM-dd-yyyy'}; 
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>Create a date time converter using the standard format length</caption>
 * var options = {formatType: 'date', dateFormat: 'medium'}; 
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with IANA timezone ID with 
 * isoStrFormat of offset.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'America/Los_Angeles', isoStrFormat: 'offset'}; 
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with Etc/GMT timezone ID with 
 * isoStrFormat of zulu.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'Etc/GMT-08:00', isoStrFormat: 'zulu'};  
 * var converterFactory = oj.Validation.converterFactory("datetime");
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @export
 * @augments oj.DateTimeConverter 
 * @name oj.IntlDateTimeConverter
 * @since 0.6
 */
oj.IntlDateTimeConverter = function(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.IntlDateTimeConverter, oj.DateTimeConverter, "oj.IntlDateTimeConverter");
oj.IntlDateTimeConverter._DEFAULT_DATE = new Date(1998, 10, 29, 15, 45, 31);

/**
 * Initializes the date time converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to initialize 
 * the converter.<p>
 * 
 * @export
 */
oj.IntlDateTimeConverter.prototype.Init = function(options) 
{
  oj.IntlDateTimeConverter.superclass.Init.call(this, options);
};


// Returns the wrapped date time converter implementation object.
oj.IntlDateTimeConverter.prototype._getWrapped = function ()
{
  if (!this._wrapped)
  {
    this._wrapped = OraDateTimeConverter.getInstance();
  }
  
  return this._wrapped;
};

/**
 * Formats the isoString value using the options provided and returns a string value. 
 * <p>
 * 
 * @param {string} value to be formatted for display which should be an isoString
 * @return {string|Object} the formatted value suitable for display
 * 
 * @throws {Error} a ConverterError both when formatting fails, and if the options provided during 
 * initialization cannot be resolved correctly.
 * 
 * @example <caption>To convert Javascript Date to a local iso string before passing to <code class="prettyprint">format</code></caption>
 * var date = new Date();
 * var formatted = converter.format(oj.IntlConverterUtils.dateToLocalIso(date));
 *
 * @example <caption>Standard format invocation
 * var formatted = converter.format("2013-12-01T20:00:00-08:00");
 * 
 * @see oj.IntlConverterUtils.dateToLocalIso
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.format = function (value) 
{
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;
  
  // undefined, null and empty string values all return null. If value is NaN then return "".
  // TODO: Should we automatically parse() the integer value representing the number of milliseconds 
  // since 1 January 1970 00:00:00 UTC (Unix Epoch)?
  if (value == null || 
      (typeof value === "string" && (oj.StringUtils.trim("" + value)).length === 0)) 
  {
    return oj.IntlConverterUtils.__getNullFormattedValue();
  }
  
  try
  {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};


/**
 * Formats an ISOString as a relative date time, using the relativeOptions. 
 * <p>
 * 
 * @param {string} value - value to be formatted. This value is compared with the current date 
 * on the client to arrive at the relative formatted value.
 * @param {Object} relativeOptions - an Object literal containing the following properties. The 
 * default options are ignored during relative formatting - 
 * @param {string=} relativeOptions.formatUsing - Specifies the relative formatting convention to. 
 * Allowed values are "displayName" and “calendar”. Setting value to 'displayName' uses the relative 
 * display name for the instance of the dateField, and one or two past and future instances. 
 * When omitted we use the implicit rules.
 * @param {string=} relativeOptions.dateField - To be used in conjunction of 'displayName'  value 
 * of formatUsing attribute.  Allowed values are: "day", "week", "month", "year", "hour", "minute", "second".
 * @param {string=} relativeOptions.relativeTime - Allowed values are: "fromNow", "toNow". 
 * "fromNow" means the system's current date is the reference and "toNow" means the value attribute 
 * is the reference. Default "fromNow".
 * @param {boolean=} relativeOptions.dateOnly - A boolean value that can be used in conjunction with 
 * “calendar” of formatUsing attribute.  When set to true date only format is used. Example: “Sunday”  
 * instead of “Sunday at 2:30 PM”. Default value is false.
 * @param {string=} relativeOptions.timeZone - The timeZone attribute can be used to specify the 
 * time zone of the  value parameter.  The system’s time zone is used for the current time. If timeZone 
 * attribute is not specified, we use the system’s time zone  for both. The value parameter, which is an 
 * iso string, can be Z or contain and offset, in this case  the timeZone attribute is overwritten.
 *
 * @return {string|null} relative date. null if the value falls out side the supported relative range.
 * @throws {Object} an instance of {@link oj.ConverterError}
 * 
 * @example <caption>Relative time in the future using implicit rules</caption>
 * var dateInFuture = new Date();
 * dateInFuture.setMinutes(dateInFuture.getMinutes() + 41);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(dateInFuture)); -> in 41 minutes
 *
 * @example <caption>Relative time in the past using implicit rules</caption>
 * var dateInPase = new Date();
 * dateInPase.setHours( dateInPast.getHours() - 20);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(dateInPase)); -> 20 hours ago
 *
 * @example <caption>Relative time using dateField. Assuming system’s current date is 2016-07-28.</caption>
 * Format relative year:
 * var options = {formatUsing: ”displayName”, dateField: “year”};
 * var formatted = converter.formatRelative("2015-06-01T00:00:00", options); -> last year
 *
 * @example <caption>Relative time using relativeTime. Assuming system’s current date is 2016-07-28.</caption>
 * var options = {formatUsing: ”displayName”, dateField: “day”, relativeTime: ”fromNow”};
 * var formatted = converter.formatRelative("2016-07-28T00:00:00", options); -> tomorrow
 * options = {formatUsing: ”displayName”, dateField: “day”, relativeTime: toNow};
 * formatted = converter.formatRelative("2016-07-28T00:00:00", options); -> yesterday
 *
 * @example <caption>Relative time using calendar. Assuming system’s current date is 2016-07-28.</caption>
 * var options = {formatUsing: ”calendar”};
 * var formatted = converter.formatRelative("2016-07-28T14:15:00", options); -> tomorrow at 2:30 PM
 *
 * 
 * @example <caption>Relative time using timeZone. Assuming that the system’s time zone is America/Los_Angeles.</caption>
 * var options = {timeZone:”America/New_York”};
 * var nyDateInFuture = new Date();
 * nyDateInFuture.setHours(nyDateInFuture.getHours() + 6);
 * var formatted = converter.formatRelative(oj.IntlConverterUtils.dateToLocalIso(nyDateInFuture), options); -> in 3 hours
 * 
 * @see oj.IntlConverterUtils.dateToLocalIso
 * 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.formatRelative = function(value, relativeOptions) 
{
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), converterError;
  try
  {
    return this._getWrapped().formatRelative(value, localeElements, relativeOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Retrieves a hint String describing the format the value is expected to be in. THe pattern used is 
 * provided through resolvedOptions, except when an actual pattern is set in the options. Otherwise 
 * hint is empty.
 * 
 * @return {String} a hint describing the format the value is expected to be in.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.getHint = function ()
{
  var resolvedOptions = this.resolvedOptions(), patternFromOptions = 
          resolvedOptions["patternFromOptions"] || this.getOptions()['pattern'];
  
  // TODO: converter hints are often shown in placeholder and is a user-friendly readable pattern. 
  // Until this feature is implemented use the CLDR pattern converted to lowercase
  return patternFromOptions ? patternFromOptions.toLowerCase() : "";
};

// Returns the hint value.
oj.IntlDateTimeConverter.prototype._getHintValue = function()
{
  var value = "";
  try
  {
    // example date 
    value =  this.format(oj.IntlConverterUtils.dateToLocalIso(oj.IntlDateTimeConverter._DEFAULT_DATE));
  }
  catch (e)
  {
    if (e instanceof oj.ConverterError)
    {
      // Something went wrong and we don't have a way to retrieve a valid value.
      // TODO: Log an error
      value = "";
    }
  }
  finally
  {
    return value;
  }
};


/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 * @memberOf oj.IntlDateTimeConverter
 * 
 */
oj.IntlDateTimeConverter.prototype.getOptions = function () 
{
  return oj.IntlDateTimeConverter.superclass.getOptions.call(this);
};

/**
 * Returns an object literal with locale and formatting options computed during initialization of 
 * the object. If options was not provided at the time of initialization, the properties will be 
 * derived from the locale defaults.
 * @return {Object} an object of resolved options. Properties whose corresponding internal 
 * properties are not present are not assigned.
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid. 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.resolvedOptions = function ()
{
  var localeElements, locale = oj.Config.getLocale(), converterError, options = this.getOptions();
  // options are resolved and cached for a locale
  if ((locale !== this._locale) || !this._resolvedOptions)
  {
    localeElements = oj.LocaleData.__getBundle();
    try
    {
      if (!localeElements)
      {
        oj.Logger.error("locale bundle for the current locale %s is unavailable", locale);
        return {};
      }
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements, 
                                                                 options, 
                                                                 locale);
      this._locale = locale;
    }
    catch (e)
    {
      converterError = this._processConverterError(e);
      throw converterError;
    }
  }
  
  return this._resolvedOptions;
};

/**
 * Returns true if a 24-hour format is set; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isHourInDaySet = function()
{
  var ro = this.resolvedOptions(), hour = ro['hour'], hour12 = ro['hour12'];
  if (hour && !hour12)
  {
    // if hour12=false or not set and hour is set to some value
    return true;
  }
  
  return false;
};

/**
 * Returns true if 12-hour is set; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isHourInAMPMSet = function()
{
  var ro = this.resolvedOptions(), hour = ro['hour'], hour12 = ro['hour12'];  
  if (hour && hour12)
  {
    // if hour12==true and hour is set to some value
    return true;
  }
  
  return false;
  
};

/**
 * Returns true if minutes are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMinuteSet = function()
{
  return this._isOptionSet('minute');
};

/**
 * Returns true if seconds are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isSecondSet = function()
{
  return this._isOptionSet('second');
};

/**
 * Returns true if milliseconds are shown in the time portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMilliSecondSet = function()
{
  return this._isOptionSet('millisecond');
};

/**
 * Returns true if year is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isYearSet = function()
{
  return this._isOptionSet('year');
};

/**
 * Returns true if month is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isMonthSet = function()
{
  return this._isOptionSet('month');
};

/**
 * Returns true if day is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isDaySet = function()
{
  return this._isOptionSet('day');
};

/**
 * Returns true if the day name is shown in the date portion; false otherwise.
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.isDayNameSet = function()
{
  return this._isOptionSet('weekday');
};

/**
 * Returns the calculated week for the isoString value
 * 
 * @param {string} value to return the calculated week of
 * @return {number} calculated week.
 * 
 * @memberOf oj.IntlDateTimeConverter
 * @export
 */
oj.IntlDateTimeConverter.prototype.calculateWeek = function(value)
{
  return this._getWrapped().calculateWeek(value, oj.LocaleData.__getBundle(), oj.Config.getLocale());
};

/**
 * Parses the value using the options provided and returns the date and time as a string 
 * expressed using the ISO-8601 format (http://en.wikipedia.org/wiki/ISO_8601).
 * 
 * <p>
 * For converter options specific to a date, the iso date representation alone is returned. <br/>
 * For time only options, the iso time representation alone is returned. <br/>
 * For options that include both date and time, the iso date and time representation is 
 * returned.<br/>
 * </p>
 * 
 * <p>
 * For convenience, if one wishes to retrieve a JavaScript Date object from the local isoString, a 
 * utility function oj.IntlConverterUtils.isoToLocalDate is provided.
 * 
 * Or oj.IntlConverterUtils.isoToDate if one wish to utilize the timezone of the isoString.
 * </p>
 * 
 * @param {String|string} value to parse
 * @return {string|Object} the parsed value as an ISOString.
 * 
 * @throws {Error} a ConverterError both when parsing fails, and if the options provided during 
 * initialization cannot be resolved correctly. Parsing can also fail when the value includes a time
 *  zone. 
 * 
 * @example <caption>Parse date, time and date & time values using <code class="prettyprint">parse</code> method.</caption>
 * &lt;!-- For date-time values  -->
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a'};
 * var conv = oj.Validation.converterFactory('datetime').createConverter(options);
 * cnv.parse('09/11/14 03:02:01 PM'); // '2014-10-20T15:02:01'
 * 
 * &lt;!-- For date values -->
 * var options = {pattern: 'MM/dd/yy'};
 * cnv.parse('09/11/14'); // '2014-10-20'
 * 
 * &lt;!-- For time values -->
 * var options = {pattern: 'hh:mm:ss a'};
 * cnv.parse('03:02:01 PM'); // 'T15:02:01'
 * 
 * @example <caption>Convert from iso string to Javascript Date object</caption>
 * var isoString = '2014-10-20T15:02:01';
 * var date = oj.IntlConverterUtils.isoToLocalDate(converter.parse(isoString));
 * 
 * @see oj.IntlConverterUtils.isoToLocalDate
 * @see oj.IntlConverterUtils.isoToDate
 *  
 * @export
 */
oj.IntlDateTimeConverter.prototype.parse = function (value) 
{
  var result, parsed;
  // undefined, null and empty string values are ignored and not parsed. 
  if (value == null || value === "") 
  {
    return null;
  }
  
  var localeElements = oj.LocaleData.__getBundle(), locale = oj.Config.getLocale(), 
          resolvedOptions = this.resolvedOptions(), converterError;

  try
  {
    // date converter parses the value and returns an Object with 2 fields - 'value' and 'warning'
    result = this._getWrapped().parse(value, localeElements, resolvedOptions, locale); 
    parsed = result['value'];
    if (parsed)
    {
      // TODO: For now log a warning when we leniently parse a value; later we plan to flash the 
      // field.
      if (result['warning'])
      {
        oj.Logger.warn("The value " + value + " was leniently parsed to represent a date " + 
                (parsed.toString) ? parsed.toString() : parsed);
      }
      
    }
    return parsed;
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Compares 2 ISO 8601 strings, returning the time difference between the two
 * 
 * @param {string} isoStr first iso string
 * @param {string} isoStr2 second iso string
 * @return {number} the time difference between isoStr and isoStr2
 * @export
 */
oj.IntlDateTimeConverter.prototype.compareISODates = function (isoStr, isoStr2)
{
  var stringChecker = oj.StringUtils.isString;

  if(!stringChecker(isoStr) || !stringChecker(isoStr2)) 
  {
    throw new Error("Invalid arguments for compareISODates ", isoStr, isoStr2);
  }

  return this._getWrapped().compareISODates(isoStr, isoStr2, oj.LocaleData.__getBundle());
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError 
 * instance.
 * @param {Error} e
 * @param {String|string|Date|Object=} value 
 * @throws an instance of oj.ConverterError
 * @private
 */
oj.IntlDateTimeConverter.prototype._processConverterError = function (e, value)
{
  var errorInfo = e['errorInfo'], summary, detail, errorCode, parameterMap, converterError, 
          propName, resourceKey;
  if (errorInfo)
  {
    errorCode = errorInfo['errorCode'];
    parameterMap = errorInfo['parameterMap'] || {};
    oj.Assert.assertObject(parameterMap);
    propName = parameterMap['propertyName'];
    
    if (e instanceof TypeError)
    {
      if (errorCode === "optionTypesMismatch" || errorCode === "optionTypeInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof RangeError)
    {
      if (errorCode === "optionOutOfRange")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
      else if (errorCode === 'datetimeOutOfRange') // TODO: NLS should use lower case time
      {
        // The '{value}' is out of range. Enter a value between '{minValue}' and '{maxValue}' for 
        // '{propertyName}'.
        summary = oj.Translations.getTranslatedString("oj-converter.datetime.datetimeOutOfRange.summary", 
          {'propertyName': propName,
           'value': parameterMap['value']});
        detail = oj.Translations.getTranslatedString("oj-converter.datetime.datetimeOutOfRange.detail",
          {'minValue': parameterMap['minValue'],
           'maxValue': parameterMap['maxValue']});
         
        converterError = new oj.ConverterError(summary, detail);
      }
    }
    else if (e instanceof SyntaxError)
    {
      if (errorCode === "optionValueInvalid")
      {
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
      }
    }
    else if (e instanceof Error)
    {
      if (errorCode === "dateFormatMismatch")
      {
        // The '{value}' does not match the expected date format '{format}'.
        resourceKey = "oj-converter.datetime.dateFormatMismatch.summary";
      }
      else if (errorCode === "timeFormatMismatch")
      {
        // The {value} does not match the expected time format {format}.
        resourceKey = "oj-converter.datetime.timeFormatMismatch.summary";
      }
      else if (errorCode === "datetimeFormatMismatch")
      {
        resourceKey = "oj-converter.datetime.datetimeFormatMismatch.summary";
      }
      else if (errorCode === "invalidTimeZoneID")
      {
        summary = oj.Translations.getTranslatedString("oj-converter.datetime.invalidTimeZoneID.summary", 
          {'timeZoneID': parameterMap['timeZoneID']});
        detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
          {'exampleValue': this._getHintValue()}); 
        
        converterError = new oj.ConverterError(summary, detail);
      }
      else if (errorCode === "nonExistingTime")
      {
        resourceKey = "oj-converter.datetime.nonExistingTime.summary";
      }
      else if (errorCode === "missingTimeZoneData")
      {
        resourceKey = "oj-converter.datetime.missingTimeZoneData.summary";
      }
      else if (errorCode === "dateToWeekdayMismatch")
      {
        summary = oj.Translations.getTranslatedString("oj-converter.datetime.dateToWeekdayMismatch.summary", 
          {'date': parameterMap['date'], 'weekday': parameterMap['weekday']});
        detail = oj.Translations.getTranslatedString("oj-converter.datetime.dateToWeekdayMismatch.detail");
        converterError = new oj.ConverterError(summary, detail);
      }
      
      if (resourceKey)
      {
        summary = oj.Translations.getTranslatedString(resourceKey, 
          {'value': value || parameterMap['value'],
           'format': parameterMap['format']});
        
        detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
          {'exampleValue': this._getHintValue()}); 
          
        converterError = new oj.ConverterError(summary, detail);
      }
    }
  }
  
  if (!converterError)
  {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }
  
  return converterError;
};

/**
 * Checks to see if an option is present in the resolved options.
 * @param {string} optionName
 * @returns {boolean} true if optionName is present.
 * @private
 */
oj.IntlDateTimeConverter.prototype._isOptionSet = function (optionName)
{
  var ro = this.resolvedOptions(), hasOption = ro[optionName] ? true : false;
  return hasOption;
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a NumberRangeValidator that ensures the value provided is within a given range
 * @param {Object=} options an object literal used to provide the following properties
 * @param {number=} options.min - the minimum number value of the entered value.
 * @param {number=} options.max - the maximum number value of the entered value.
 * @param {Object=} options.hint - an optional object literal of hints to be used.
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.hint.max - a hint used to indicate the allowed maximum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.max</code>.<p>
\\ 
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter a number less than or equal to {max}
 * @param {string=} options.hint.min - a hint used to indicate the allowed minimum. When not present, 
 * the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum <p>
 * Usage: <br/>
 * Enter a number greater than or equal to {min}</li>
 * @param {string=} options.hint.inRange - a hint used to indicate the allowed range. When not 
 * present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.hint.inRange</code>.<p>
 * Tokens:<br/>
 * {min} the minimum<br/>
 * {max} the maximum<p>
 * Usage: <br/>
 * Enter a number between {min} and {max}
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.rangeUnderflow) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageDetail.rangeUnderflow - the detail error message to be used when 
 * input value is less than the set minimum value. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeUnderflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The number must be greater than or equal to {min}.
 * @param {string=} options.messageDetail.rangeOverflow - the detail error message to be used when 
 * input value exceeds the maximum value set. When not present, the default detail message is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageDetail.rangeOverflow</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The number must be less than or equal to {max}.     
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * @param {string=} options.messageSummary.rangeUnderflow - the summary of the error message when 
 * input value is less than the set minimum value. When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeUnderflow</code>.
 * @param {string=} options.messageSummary.rangeOverflow - the summary of the error message when 
 * input value exceeds the maximum value set.  When not present, the default message summary is 
 * the resource defined with the key 
 * <code class="prettyprint">oj-validator.range.number.messageSummary.rangeOverflow</code>.
 * @export
 * @constructor
 * @since 0.7
 * 
 */
// TODO: Probably get rid of the 'message' level, and just have 'hint', 'messageDetail', 'messageSummary'. This matches what I put in oj-translations.
oj.NumberRangeValidator = function _NumberRangeValidator(options)
{
  this.Init(options);
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.NumberRangeValidator, oj.Validator, "oj.NumberRangeValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.Init = function (options)
{
  oj.NumberRangeValidator.superclass.Init.call(this);

  
  if (options)
  {
    this._min = options["min"];
    this._max = options["max"];
    this._converter = oj.IntlConverterUtils.getConverterInstance(options['converter']);
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};
  }
};

/**
 * Validates the minimum + maximum conditions
 *
 * @param {string|number} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when value is out of range
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.validate = function (value)
{
  var string = value ? value.toString() : value, 
      numberValue = parseFloat(string), 
      customMessageSummary = this._customMessageSummary,
      customMessageDetail = this._customMessageDetail,
      messageDetailRangeOverflow = customMessageDetail["rangeOverflow"], 
      messageDetailRangeUnderflow = customMessageDetail["rangeUnderflow"], 
      messageSummaryRangeOverflow = customMessageSummary["rangeOverflow"],
      messageSummaryRangeUnderflow = customMessageSummary["rangeUnderflow"],
      min = this._min !== undefined ? parseFloat(this._min) : null, 
      max = this._max !== undefined ? parseFloat(this._max) : null, 
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max,
      summary = "", 
      detail = "", 
      params = null,
      translations = oj.Translations;
  
  if(value === null) 
  {
    // request to not throw an error when value being passed is of null
    return value;
  }
  
  if (min !== null && max !== null)
  {
    //range
    if ((numberValue >= min && numberValue <= max) || min > max)
    {
      return string;
    }
  }
  else 
  {
    //only min
    if (min !== null)
    {
      if (numberValue >= min)
      {
        return string;
      }
	  
    }
    //max only
    else 
    {
      if (max === null || numberValue <= max)
      {
        return string;
      }
    }
  }
  
  // if we haven't returned with an OK, then we need to throw a ValidatorError
  if (max !== null && numberValue > max)
  {
	  params = {"value": value, "max": maxStr};
      summary = messageSummaryRangeOverflow ? messageSummaryRangeOverflow : 
                  translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeOverflow');
      detail = messageDetailRangeOverflow ? translations.applyParameters(messageDetailRangeOverflow, params) : 
                  translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeOverflow', params);
  }
  else if (min !== null && numberValue < min)
  {
 	  params = {"value": value, "min": minStr};
      summary = messageSummaryRangeUnderflow ? messageSummaryRangeUnderflow : 
                  translations.getTranslatedString('oj-validator.range.number.messageSummary.rangeUnderflow');
      detail = messageDetailRangeUnderflow ? translations.applyParameters(messageDetailRangeUnderflow, params) : 
                  translations.getTranslatedString('oj-validator.range.number.messageDetail.rangeUnderflow', params);   
  }

  throw new oj.ValidatorError(summary, detail);
};

/**
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.NumberRangeValidator
 * @instance
 * @export
 */
oj.NumberRangeValidator.prototype.getHint = function ()
{
  var hint = null, hints = this._hint, 
      hintInRange = hints["inRange"], hintMinimum = hints["min"], hintMaximum = hints["max"],
      translations = oj.Translations,
      min = this._min !== undefined ? parseFloat(this._min) : null, 
      max = this._max !== undefined ? parseFloat(this._max) : null,
      minStr = min && this._converter ? this._converter['format'](min) : min,
      maxStr = max && this._converter ? this._converter['format'](max) : max;
	  
  if (min !== null && max !== null) 
  {
  	hint = hintInRange ? translations.applyParameters(hintInRange, {"min": minStr, "max": maxStr}) : 
	                       translations.getTranslatedString('oj-validator.range.number.hint.inRange', {"min": minStr, "max": maxStr});
  }
  else if (min !== null)
  {
    hint = hintMinimum ?  translations.applyParameters(hintMinimum, {"min": minStr}) :
	                      translations.getTranslatedString('oj-validator.range.number.hint.min', {"min": minStr});
  }
  else if (max !== null)
  {
    hint = hintMaximum ?  translations.applyParameters(hintMaximum, {"max": maxStr}) :
                          translations.getTranslatedString('oj-validator.range.number.hint.max', {"max": maxStr});
  }

  return hint;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/*global OraNumberConverter:true*/
/**
 * @export
 * Placeholder here as closure compiler objects to export annotation outside of top level
 */

/**
 * @constructor
 * @classdesc Constructs an immutable instance and initializes it with the options provided. When initialized 
 * with no options, the default options for the current locale are assumed. The converters by 
 * default use the current page locale (returned by oj.Config.getLocale()). There are several ways 
 * to initialize the converter.
 * <p>
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties style, 
 * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, 
 * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
 * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property</li>
 * <li>Using the decimalFormat option to define a compact pattern, such as "1M" and "1 million".</li>
 * <li>Using the roundingMode and roundDuringParse options to round the number HALF_UP, HALF_DOWN, or HALF_EVEN.</li>
 * </ul>
 * <p>
 * 
 * The converter provides leniency when parsing user input value to a number in the following ways:<br/>
 * 
 * <ul>
 * <li>Prefix and suffix that do not match the pattern, are removed. E.g., when pattern is 
 * "#,##0.00%" (suffix is the % character), a value of "abc-123.45xyz", will be leniently parsed to 
 * -123.45</li>
 * <li>When a value includes a symbol but the pattern doesn't require it.  E.g., the options are 
 * {pattern: "###", currency: 'USD'}, then values ($123), (123) and -123 will be leniently parsed as 
 * -123.</li>
 * </ul>
 * <p>
 * @property {Object=} options - an object literal used to provide optional information to 
 * initialize the converter.
 * @property {string=} options.style - sets the style of number formatting. Allowed values are "decimal" 
 * (the default), "currency" or "percent". When a number is formatted as a decimal, the decimal 
 * character is replaced with the most appropriate symbol for the locale. In English this is a 
 * decimal point ("."), while in many locales it is a decimal comma (","). If grouping is enabled the 
 * locale dependent grouping separator is also used. These symbols are also used for numbers 
 * formatted as currency or a percentage, where appropriate.
 * @property {string=} options.currency - specifies the currency that will be used when formatting the 
 * number. The value should be a ISO 4217 alphabetic currency code. If the style is set to currency, 
 * it's required that the currency property also be specified. This is because there is no default 
 * currency associated with the current locale. The user must always specify the currency code 
 * to be shown, otherwise an error will be thrown. The current page locale 
 * (returned by oj.Config.getLocale()) determines the formatting elements of the number 
 * like grouping separator and decimal separator. The currency code tells us which currency to 
 * display in current page locale. JET has translations for currency names.
 * <p>
 * As an example if we want to format 1000.35 EURO and the page locale is "en-US", 
 * we pass {style:'currency', currency:'EUR', currencyDisplay:'symbol'} and we will get "€1,000.35"
 * If the page locale is "fr-FR", with the same options, we will get: "1 000,35 €"
 * </p>
 * @property {string=} options.currencyDisplay - if the number is using currency formatting, specifies 
 * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code), 
 * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so 
 * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name". 
 * The default is "symbol".
 * @property {string=} options.decimalFormat -
 * specifies the decimal format length to use when style is set to "decimal". 
 * Allowed values are : "standard"(default), "short" and "long". 'standard' is equivalent to not 
 * specifying the 'decimalFormat' attribute, in that case the locale’s default decimal pattern 
 * is used for formatting.
 * <p>
 * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display. 
 * When not present we use the locale's default max and min fraction digits.
 * </p>
 * <p>
 * There is no need to specify the scale; we automatically detect greatest scale that is less or 
 * equal than the input number. For example  1000000 is formatted as "1M" or "1 million" and
 * 1234 is formatted, with zero fractional digits, as "1K" or " 1 thousand" for 
 * short and long formats respectively. The pattern for the short and long number is locale dependent 
 * and uses plural rules for the particular locale.
 * </p>
 * <p>
 * NOTE: Currently this option formats a value (e.g., 2000 -> 2K), but it does not parse a value 
 * (e.g., 2K -> 2000), so it can only be used
 * in a readOnly EditableValue because readOnly EditableValue components do not call
 * the converter's parse function.
 * </p>
 * @property {number=} options.minimumIntegerDigits - sets the minimum number of digits before the 
 * decimal place (known as integer digits). The number is padded with leading zeros if it would not 
 * otherwise have enough digits. The value must be an integer between 1 and 21.
 * @property {number=} options.minimumFractionDigits - similar to 'minimumIntegerDigits', except it 
 * deals with the digits after the decimal place (fractional digits). It must be an integer between 
 * 0 and 20. The fractional digits will be padded with trailing zeros if they are less than the minimum.
 * @property {number=} options.maximumFractionDigits - follows the same rules as 'minimumFractionDigits', 
 * but sets the maximum number of fractional digits that are allowed. The value will be rounded if 
 * there are more digits than the maximum specified.
 * @property {boolean=} options.useGrouping - when the value is truthy, the locale dependent grouping 
 * separator is used when formatting the number. This is often known as the thousands separator, 
 * although it is up to the locale where it is placed. The ‘useGrouping’ is set to true by default.
 * @property {string=} options.pattern an optional localized pattern, where the characters used in 
 * pattern are as defined in the Unicode CLDR for numbers, percent or currency formats. When present 
 * this will override the other "options". <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a currency style the 'currency' property is required to 
 * be set, as not setting this will throw an error. The 'currencyDisplay' is optional. <br/>Example: 
 * {pattern: '¤#,##0', currency: 'USD'}. <p>
 * 
 * &nbsp;&nbsp;- It's not mandatory for the pattern to have the special character '¤' (currency sign) 
 * be present. When not present, values are treated as a currency value, but are not formatted to 
 * show the currency symbol. <br/>Example: {pattern: '#,##0', currency: 'USD'} <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a percent style, the percent special character ('%') needs to be 
 * explicitly specified in the pattern, e.g., {pattern: "#,##0%"}. If the pattern does not contain 
 * the percent character it's treated as a decimal pattern, unless the style is set to percent, 
 * in which case the value is treated as a percent value, but not formatted to show the percent symbol. 
 * <br/>Example: {style: 'percent', pattern: "#,##0"}. <p>
 * 
 * &nbsp;&nbsp;- A decimal pattern or exponent pattern is specified in the pattern using the CLDR 
 * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E+0"}. <p>
 * 
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a pattern will override the default 
 * locale specific format. <br/>
 * 
 * @property {string=} options.roundingMode - specifies the rounding behavior. 
 * This follows the Java.Math.RoundingMode behavior.
 * Currently we support the options: HALF_UP, HALF_DOWN, and HALF_EVEN 
 * 
 * @property {boolean=} options.roundDuringParse - Specifies whether or not to round during
 * parse. Defaults to false; the number converter rounds during format but not during parse.
 * 
 * @example <caption>Create a number converter for currencies</caption>
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
 * converter = converterFactory.createConverter(options);
 * converter.format(9); --> "$09.00" if page locale is 'en-US'
 * converter.format(9); --> "09,00 $US" if page locale is 'fr-FR'<br/>
 * 
 * @example <caption>A number converter for percent values using a custom (CLDR) pattern</caption>
 * var converterFactory = oj.Validation.converterFactory("number");
 * var options = {pattern: '#,##0%'};
 * converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
 * var options = {style: 'percent', pattern: '#,##0'};<br/>
 * 
 * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
 * var options = {pattern: '¤#,##0', currency: 'USD'};
 * 
 * @example <caption>The following decimalFormat examples are in en locale.
 * To format a value as short (default for fraction digits is based on the locale)</caption>
 * var options = {style:’decimal’, decimalFormat:’short’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.354K<br/>
 * 
 * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
 * var options = {style:’decimal’, decimalFormat:’long’};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12.345 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * minimumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(1234);--> 1.2340K<br/>
 * 
 * @example <caption>To format a value as short with maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’short’, 
 * maximumFractionDigits:0};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12K<br/>
 * 
 * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12000);--> 12.00 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
 * options = { style:’decimal’, decimalFormat:’long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * converter = converterFactory.createConverter(options);
 * converter.format(12345678);--> 12.345 million<br/>
 * 
 * @example <caption>decimal style default is standard:</caption>
 * options = { style:’decimal’, decimalFormat:’standard’}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(12345);--> 12,345<br/>
 * 
 * @example <caption>decimal round HALF_DOWN:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_DOWN'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.parse(0.225);-->0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_UP:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_UP'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.23
 * converter.parse(0.225);--> 0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_EVEN:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, roundingMode:'HALF_EVEN'}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.format(0.235);--> 0.24
 * converter.parse(0.225);--> 0.225 //doesn't round during parse by default
 * converter.parse(0.235);--> 0.235 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_DOWN and roundDuringParse:</caption>
 * options = { style:’decimal’, maximumFractionDigits:2, 
 *             roundingMode:'HALF_DOWN', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.parse(0.225);-->0.22<br/>
 * 
 * @example <caption>decimal round HALF_UP and roundDuringParse:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, 
 *             roundingMode:'HALF_UP', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.23
 * converter.parse(0.225);--> 0.23<br/>
 * 
 * @example <caption>decimal round HALF_EVEN and roundDuringParse:</caption>
 * options = { style:’decimal’,  maximumFractionDigits:2, 
 *             roundingMode:'HALF_EVEN', roundDuringParse: true}; 
 * converter = converterFactory.createConverter(options);
 * converter.format(0.225);--> 0.22
 * converter.format(0.235);--> 0.24
 * converter.parse(0.225);--> 0.22
 * converter.parse(0.235);--> 0.24<br/>
 * 
 * @export
 * @augments oj.NumberConverter 
 * @name oj.IntlNumberConverter
 * @since 0.6
 */
oj.IntlNumberConverter = function(options)
{
  this.Init(options);
};

oj.Object.createSubclass(oj.IntlNumberConverter, oj.NumberConverter, "oj.IntlNumberConverter");

/**
 * Initializes the number converter instance with the set options.
 * @param {Object=} options an object literal used to provide an optional information to 
 * initialize the converter.<p>
 * @export
 */
oj.IntlNumberConverter.prototype.Init = function(options) 
{
  oj.IntlNumberConverter.superclass.Init.call(this, options);
};


// Returns the wrapped number converter implementation object.
oj.IntlNumberConverter.prototype._getWrapped = function ()
{
  if (!this._wrapped)
  {
    this._wrapped = OraNumberConverter.getInstance();
  }
  
  return this._wrapped;
};

/**
 * Formats a Number and returns the formatted string, using the options this converter was 
 * initialized with.
 * 
 * @param {Number|number} value to be formatted for display
 * @return {string} the localized and formatted value suitable for display. When the value is 
 * formatted as a percent it's multiplied by 100.
 * 
 * @throws {Error} a ConverterError both when formatting fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 * 
 * @export
 */
oj.IntlNumberConverter.prototype.format = function (value) 
{
  var converterError;
  var locale;
  var localeElements;
  var resolvedOptions;

  // undefined, null and empty string values all return null. If value is NaN then return "".
  if (value == null || 
      (typeof value === "string" && (oj.StringUtils.trim("" + value)).length === 0) ||
      (typeof value === "number" && isNaN(value))) 
  {
    return oj.IntlConverterUtils.__getNullFormattedValue();
  }
  
  locale = oj.Config.getLocale();
  localeElements = oj.LocaleData.__getBundle();
  resolvedOptions = this.resolvedOptions();

  
  try
  {
    return this._getWrapped().format(value, localeElements, resolvedOptions, locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
};

/**
 * Retrieves a hint String describing the format the value is expected to be in.
 * 
 * @return {String} a hint describing the format the value is expected to be in.
 * @export
 */
oj.IntlNumberConverter.prototype.getHint = function ()
{
  // UX does not want any hint for numbers. 
  // return oj.Translations.getTranslatedString("oj-converter.hint.summary",
  //        {'exampleValue': this._getHintValue()}); 
  //return oj.IntlNumberConverter.superclass.getHint.call(this); // this asserts, and we don't want that.
  return null;
};

/**
 * Returns the options called with converter initialization.
 * @return {Object} an object of options.
 * @export
 */
oj.IntlNumberConverter.prototype.getOptions = function () 
{
  return oj.IntlNumberConverter.superclass.getOptions.call(this);
};

/**
 * Parses a string value to return a Number, using the options this converter was initialized with. 
 * 
 * @param {String|string} value to parse
 * @return {number|null} the parsed number or null if the value was null or an empty string. When 
 * the value is parsed as a percent its 1/100th part is returned.
 * 
 * @throws {Error} a ConverterError both when parsing fails, or if the options provided during 
 * initialization cannot be resolved correctly. 
 *  
 * @export
 */
oj.IntlNumberConverter.prototype.parse = function (value) 
{
  var converterError;
  var locale; 
  var localeElements;
  var resolvedOptions;

  // null and empty string values are ignored and not parsed. It
  // undefined.
  if (value == null || value === "") // check for undefined, null and ""
  {
    return null;
  }
  
  locale = oj.Config.getLocale(); 
  localeElements = oj.LocaleData.__getBundle();
  resolvedOptions = this.resolvedOptions();
  
  try
  {
    // we want to trim the value for leading spaces before and after
    return this._getWrapped().parse(oj.StringUtils.trim(value), 
                                    localeElements, 
                                    resolvedOptions, 
                                    locale);
  }
  catch (e)
  {
    converterError = this._processConverterError(e, value);
    throw converterError;
  }
  
};

/**
 * Returns an object literal with properties reflecting the number formatting options computed based 
 * on the options parameter. If options (or pattern) is not provided, the properties will be derived 
 * from the locale defaults.
 * 
 * @return {Object} An object literal containing the resolved values for the following options. Some 
 * of these properties may not be present, indicating that the corresponding components will not be 
 * represented in the formatted output.
 * <ul>
 * <li><b>locale</b>: a String value with the language tag of the locale whose localization is used 
 * for formatting.</li>
 * <li><b>style</b>: a String value. One of the allowed values - "decimal", "currency" or "percent".</li>
 * <li><b>currency</b>: a String value.  an ISO 4217 alphabetic currency code. May be present only 
 *  when style is currency.</li>
 * <li><b>currencyDisplay</b>: a String value. One of the allowed values - "code", "symbol", or 
 *  "name".</li>
 * <li><b>numberingSystem</b>: a String value of the numbering system used. E.g. latn</li>
 * <li><b>minimumIntegerDigits</b>: a non-negative integer Number value indicating the minimum 
 *  integer digits to be used.</li>
 * <li><b>minimumFractionDigits</b>: a non-negative integer Number value indicating the minimum 
 *  fraction digits to be used.</li>
 * <li><b>maximumFractionDigits</b>: a non-negative integer Number value indicating the maximum 
 *  fraction digits to be used.</li>
 * <li><b>useGrouping</b>: a Boolean value indicating whether a grouping separator is used.</li>
 * 
 * @throws a oj.ConverterError when the options that the converter was initialized with are invalid. 
 * @export
 */
oj.IntlNumberConverter.prototype.resolvedOptions = function()
{
  var converterError;
  var locale = oj.Config.getLocale();
  var localeElements;
  
  // options are resolved and cached for the current locale. when locale changes resolvedOptions 
  // is reevaluated as it contains locale specific info.
  if ((locale !== this._locale) || !this._resolvedOptions)
  {
    localeElements = oj.LocaleData.__getBundle();
    try
    {
      if (!localeElements)
      {
        oj.Logger.error("locale bundle for the current locale %s is unavailable", locale);
        return {};
      }
      
      // cache if successfully resolved
      this._resolvedOptions = this._getWrapped().resolvedOptions(localeElements, 
                                                                 this.getOptions(), 
                                                                 locale);
      this._locale = locale;
    }
    catch (e)
    {
      converterError = this._processConverterError(e);
      throw converterError;
    }
  }
  
  return this._resolvedOptions;
};

/**
 * Processes the error returned by the converter implementation and throws a oj.ConverterError 
 * instance.
 * 
 * @param {Error} e
 * @param {String|string|Number|number|Object=} value
 * @throws an instance of oj.ConverterError
 * @private
 */
oj.IntlNumberConverter.prototype._processConverterError = function (e, value)
{
  var converterError;
  var errorCode;
  var errorInfo = e['errorInfo'];
  var detail;
  var parameterMap;
  var propName;
  var resourceKey;
  var summary;

  if (errorInfo)
  {
    errorCode = errorInfo['errorCode'];
    parameterMap = errorInfo['parameterMap'];
    oj.Assert.assertObject(parameterMap);
    propName = parameterMap['propertyName'];
    
    switch (errorCode)
    {
      case "optionTypesMismatch":
      case "optionTypeInvalid":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "optionOutOfRange":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "optionValueInvalid":
        converterError = oj.IntlConverterUtils.__getConverterOptionError(errorCode, parameterMap);
        break;
      case "decimalFormatMismatch":
        // The '{value}' does not match the expected decimal format
        resourceKey = "oj-converter.number.decimalFormatMismatch.summary";
        break;
      case "currencyFormatMismatch":
        // The {value} does not match the expected currency format
        resourceKey = "oj-converter.number.currencyFormatMismatch.summary";
        break;
      case "percentFormatMismatch":
        // The {value} does not match the expected currency format
        resourceKey = "oj-converter.number.percentFormatMismatch.summary";
        break;  
      case "unsupportedParseFormat":
        // TODO: We'll be able to remove this exception when this bug is fixed post V1.1:
        //  - implement parse() for short number converter
        //  
        summary =  oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.summary");
        detail = oj.Translations.getTranslatedString(
          "oj-converter.number.decimalFormatUnsupportedParse.detail");
        converterError = new oj.ConverterError(summary, detail);
    }

    // The formatMismatch errors need a hint
    if (resourceKey)
    {
      summary = oj.Translations.getTranslatedString(resourceKey, 
        {'value': value || parameterMap['value'],
         'format': parameterMap['format']});

      // _getHintValue is smart. It uses the converter's 'format' function
      //  to get the example format to show the end user.
      detail = oj.Translations.getTranslatedString("oj-converter.hint.detail",
        {'exampleValue': this._getHintValue()}); 

      converterError = new oj.ConverterError(summary, detail);
    }

  }
  
  if (!converterError)
  {
    // An error we are unfamiliar with. Get the message and set as detail
    summary = e.message; // TODO: What should the summary be when it's missing??
    detail = e.message;
    converterError = new oj.ConverterError(summary, detail);
  }
  
  return converterError;
};

// Returns the hint value. It uses the converter's format function to return a formatted
// example. For example, if the converter's style is decimal and decimalFormat is short,
// this.format(12345.98765) returns 12K, and we show 12K in the error message as an example
// of what they should type in.
oj.IntlNumberConverter.prototype._getHintValue = function()
{
  var value = "";
  try
  {
    // use .format to get a real example to show the user what format they can type in to the field.
    value =  this.format(12345.98765);
  }
  catch (e)
  {
    if (e instanceof oj.ConverterError)
    {
      // Something went wrong and we don't have a way to retrieve a valid value.    
      value = "";
      oj.Logger.error("error retrieving hint value in format");
    }
  }
  finally
  {
    // returns the formatted value of 12345.98765
    return value;
  }
};

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/** This is a forked version of moment-timezone.js
 * The MIT License (MIT)
 * Copyright (c) 2014 Tim Wood
 * https://github.com/moment/moment-timezone/blob/develop/LICENSE
 */

/*
 DESCRIPTION
 OraTimeZone object implements timeZone support.
 
 PRIVATE CLASSES
 <list of private classes defined - with one-line descriptions>
 
 NOTES
 <other useful comments, qualifications, etc.>
 
 MODIFIED    (MM/DD/YY)
        02/01/15 - Creation
 */



/**
 * @ignore
 */
var OraTimeZone;

OraTimeZone = (function () {

  var _zones = {};
  var instance;
  var _charCodeToInt;
  var _unpackBase60;
  var _arrayToInt;
  var _intToUntil;
  var _mapIndices;
  var _unpack;
  var _packBase60;
  var _packBase60Fraction;
  var  _normalizeName;
  var _getZone;
  var _addZone;
  var _throwInvalidtimeZoneID;
  var _throwNonExistingTime;
  var _throwMissingTimeZoneData;
  var _GMT_REGEXP = /^Etc\/GMT/i;
  var _SECOND = 1000;
  var _MINUTE = 60 * _SECOND;
  var _HOUR = 60 * _MINUTE;
  var _MIN_OFFSET = -14 * 60;
  var _MAX_OFFSET = +12 * 60;

  /************************************
   Unpacking
   ************************************/

  var __BASE60 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWX';
  var  _EPSILON = 0.000001; // Used to fix floating point rounding errors

  _packBase60Fraction = function (fraction, precision) {
    var buffer = '.',
      output = '',
      current;

    while (precision > 0) {
      precision -= 1;
      fraction *= 60;
      current = Math.floor(fraction + _EPSILON);
      buffer += __BASE60[current];
      fraction -= current;

      // Only add buffer to output once we have a non-zero value.
      // This makes '.000' output '', and '.100' output '.1'
      if (current) {
        output += buffer;
        buffer = '';
      }
    }

    return output;
  };

  _packBase60 = function (number, precision) {
    var output = '';
    var  absolute = Math.abs(number);
    var  whole = Math.floor(absolute);
    var  fraction = _packBase60Fraction(absolute - whole, Math.min(~~precision, 10));

    while (whole > 0) {
      output = __BASE60[whole % 60] + output;
      whole = Math.floor(whole / 60);
    }

    if (number < 0) {
      output = '-' + output;
    }

    if (output && fraction) {
      return output + fraction;
    }

    if (!fraction && output === '-') {
      return '0';
    }

    return output || fraction || '0';
  };

  /************************************
   Unpacking
   ************************************/
  _charCodeToInt = function (charCode) {
    if (charCode > 96) {
      return charCode - 87;
    }
    else if (charCode > 64) {
      return charCode - 29;
    }
    return charCode - 48;
  };

  _unpackBase60 = function (string) {
    var i = 0;
    var parts = string.split('.');
    var whole = parts[0];
    var fractional = parts[1] || '';
    var multiplier = 1;
    var num;
    var out = 0;
    var sign = 1;

    // handle negative numbers
    if (string.charCodeAt(0) === 45) {
      i = 1;
      sign = -1;
    }
    // handle digits before the decimal
    for (; i < whole.length; i++) {
      num = _charCodeToInt(whole.charCodeAt(i));
      out = 60 * out + num;
    }
    // handle digits after the decimal
    for (i = 0; i < fractional.length; i++) {
      multiplier = multiplier / 60;
      num = _charCodeToInt(fractional.charCodeAt(i));
      out += num * multiplier;
    }
    return out * sign;
  };


  _arrayToInt = function (array) {
    for (var i = 0; i < array.length; i++) {
      array[i] = _unpackBase60(array[i]);
    }
  };

  _intToUntil = function (array, length) {
    for (var i = 0; i < length; i++) {
      array[i] = Math.round((array[i - 1] || 0) + (array[i] * _MINUTE)); // minutes to milliseconds
    }

    array[length - 1] = Infinity;
  };

  _mapIndices = function (source, indices) {
    var out = [], i;
    for (i = 0; i < indices.length; i++) {
      out[i] = source[indices[i]];
    }
    return out;
  };

  _unpack = function (id, string) {
    var data = string.split('|');
    var  offsets = data[1].split(' ');
    var  indices = data[2].split('');
    var  untils = data[3].split(' ');

    _arrayToInt(offsets);
    _arrayToInt(indices);
    _arrayToInt(untils);
    _intToUntil(untils, indices.length);
    return {
      name : id,
      abbrs : _mapIndices(data[0].split(' '), indices),
      offsets : _mapIndices(offsets, indices),
      untils : untils
    };
  };

  /************************************
   Exceptions
   ************************************/
  _throwInvalidtimeZoneID = function (str) {
    var msg, error, errorInfo;
    msg = "invalid timeZone ID: " + str;
    error = new Error(msg);
    errorInfo = {
      'errorCode' : 'invalidTimeZoneID',
      'parameterMap' : {
        'timeZoneID' : str
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  _throwNonExistingTime = function () {
    var msg, error, errorInfo;
    msg = "The input time does not exist because it falls during the transition to daylight saving time.";
    error = new Error(msg);
    errorInfo = {
      'errorCode' : 'nonExistingTime'
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };
  
  _throwMissingTimeZoneData = function () {
    var msg, error, errorInfo;
    msg = "TimeZone data is missing. Please call require 'ojs/ojtimezonedata' in order to load the TimeZone data.";
    error = new Error(msg);
    errorInfo = {
      'errorCode' : 'missingTimeZoneData'
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  /************************************
   Zone object
   ************************************/

  /**
   * @ignore
   * @constructor
   */
  function Zone (name, tzData) {
    var data = tzData['zones'][name];
    //Try  if name matches Etc/GMT offset
    if (_GMT_REGEXP.test(name)) {
      var hours, minutes = 0;
      var offset = name.replace(_GMT_REGEXP, "");
      var parts = offset.split(":");
      hours = parseInt(parts[0], 10) * 60;
      if (isNaN(hours))
        return;
      if (parts.length === 2) {
        minutes = parseInt(parts[1], 10);
        if (isNaN(minutes))
          return;
      }
      hours += (hours >= 0) ? minutes : -minutes;
      //offset must be between -14 and +12
      if (hours < _MIN_OFFSET || hours > _MAX_OFFSET)
        return;
      hours = _packBase60(hours, 1);
      var gmtName = name.replace("/etc\//i", "").toUpperCase();
      data = gmtName + "|" + hours + "|" + "0|";
    }
    if (data !== undefined)
      this._set(_unpack(name, data));
  }

  Zone.prototype = {
    _set : function (unpacked) {
      this.name = unpacked.name;
      this.abbrs = unpacked.abbrs;
      this.untils = unpacked.untils;
      this.offsets = unpacked.offsets;
    },
    parse : function (target, dst, ignoreDst, throwException) {
      var offsets = this.offsets;
      var  untils = this.untils;
      var  max = untils.length - 1;
      var  offset;
      var offset1;
      var i;
      var transitionTime;
      var gapTime;
      var dupTime;
      var until;
      for (i = 0; i < max; i++) {
        offset = offsets[i];
        offset1 = offsets[i + 1];
        until = untils[i];
        transitionTime = until - (offset * _MINUTE);
        gapTime = transitionTime + _HOUR;
        dupTime = transitionTime - _HOUR;
        //Transition to dst:
        //Test if the time falls during the non existing hour when trasition to
        //dst happens. The missing hour is between transitionTime and gapTime.
        //If we are converting from source timezone to target timezone, we do not
        //throw an exception if target timezone falls in non existing window, 
        //we just skip one hour, throwException is passed as false in this scenario.
        if (target >= transitionTime && target < gapTime && offset > offset1) {
          if(throwException === true) {
            _throwNonExistingTime();
          }
          else {
            return (i + 1);
          }
        }
        //Test if the time falls during the duplicate hour when dst ends.
        //The duplicate hour is between dupTime and transitionTime.
        //if dst is set to true, return dst offset.
        if (target >= dupTime && target < transitionTime && offset < offset1) {
          if (dst) {
            return i;
          }
          return (i + 1);
        }
        //Time is outside transtition times.
        if (target < until - (offset * _MINUTE)) {
          if (ignoreDst === false) {
            if (dst) {
              if (offset < offset1) {
                return i;
              }
              return (i + 1);
            }
            else {
              if (offset < offset1) {
                return (i +1);
              }
              return i;
            }
          }
          return i;
        }
      }
      return max;
    },
    //user first need to call pasre to get the index, then pass it to the 
    //2 functions below
    abbr : function (idx) {
      return this.abbrs[idx];
    },
    ofset : function (idx) {
      var len = this.offsets.length;
      if(idx >= 0 && idx < len) {
        return parseInt(this.offsets[idx], 10);
      }  
      return parseInt(this.offsets[len -1], 10);
    },
    len : function () {
      return this.offsets.length;
    }
  };

  /************************************
   timeZOne functions
   ************************************/
  _normalizeName = function (name) {
    return (name || '').toLowerCase().replace(/\//g, '_');
  };

  _addZone = function (name, tzData) {
    var zone, zoneName;
    zone = new Zone(name, tzData);
    zoneName = _normalizeName(zone['name']);
    _zones[zoneName] = zone;
  };

  _getZone = function (name, tzData) {
    var zoneName = _normalizeName(name);
    if (_zones[zoneName] === undefined)
      _addZone(name, tzData);
    return _zones[_normalizeName(name)] || null;
  };


  function _init () {
    return {
      getZone : function (name, localeElements) {
        var tzData = localeElements['supplemental']['timeZoneData'];
        if(tzData === undefined) {
          _throwMissingTimeZoneData();
        }
        var s = _getZone(name, tzData);
        //try the links
        if (!s) {          
          var link = tzData['links'][name];
          if (link) {
            s = _getZone(link, tzData);
          }
        }
        if (!s) {
          _throwInvalidtimeZoneID(name);
        }
        return s;
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraTimeZone class. 
     * @ignore
     * @memberOf OraTimeZone
     * @return {Object} The singleton OraTimeZone instance.
     */
    getInstance : function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());
/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
/**
 * @constructor
 * 
 * @classdesc OraNumberConverter object implements number parsing and formatting for
 * decimal, currency, percent and perMill types. It supports ECMA-402 options 
 * and user defined pattern. The user defined pattern is parsed in order to 
 * derive the options that can be specified as ECMA options.
 * There are several ways to use the converter.
 * <p>
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties style, 
 * currency, currencyDisplay, minimumIntegerDigits, minimumFractionDigits, maximumFractionDigits, 
 * useGrouping. NOTE: minimumSignificantDigits and maximumSignificantDigits are not supported.</li>
 * <li>Using a custom decimal, currency or percent format pattern. specified using the 'pattern' property</li>
 * <li>Using the decimalFormat option to define a compact pattern, such as "1M" and "1 million".</li>
 * <li>Using the roundingMode and roundDuringParse options to round the number HALF_UP, HALF_DOWN, or HALF_EVEN.</li>
 * </ul>
 * <p>
 * 
 * The converter provides leniency when parsing user input value to a number in the following ways:<br/>
 * 
 * <ul>
 * <li>Prefix and suffix that do not match the pattern, are removed. E.g., when pattern is 
 * "#,##0.00%" (suffix is the % character), a value of "abc-123.45xyz", will be leniently parsed to 
 * -123.45</li>
 * <li>When a value includes a symbol but the pattern doesn't require it.  E.g., the options are 
 * {pattern: "###", currency: 'USD'}, then values ($123), (123) and -123 will be leniently parsed as 
 * -123.</li>
 * </ul>
 * <p>
 * @property {Object=} options - an object literal used to provide optional information to 
 * initialize the converter.
 * @property {string=} options.style - sets the style of number formatting. Allowed values are "decimal" 
 * (the default), "currency" or "percent". When a number is formatted as a decimal, the decimal 
 * character is replaced with the most appropriate symbol for the locale. In English this is a 
 * decimal point ("."), while in many locales it is a decimal comma (","). If grouping is enabled the 
 * locale dependent grouping separator is also used. These symbols are also used for numbers 
 * formatted as currency or a percentage, where appropriate.
 * @property {string=} options.currency - specifies the currency that will be used when formatting the 
 * number. The value should be a ISO 4217 alphabetic currency code. If the style is set to currency, 
 * it's required that the currency property also be specified. This is because there is no default 
 * currency associated with the current locale. The user must always specify the currency code 
 * to be shown, otherwise an error will be thrown. The current page locale 
 * (returned by oj.Config.getLocale()) determines the formatting elements of the number 
 * like grouping separator and decimal separator. The currency code tells us which currency to 
 * display in current page locale. JET has translations for currency names.
 * <p>
 * As an example if we want to format 1000.35 EURO and the page locale is "en-US", 
 * we pass {style:'currency', currency:'EUR', currencyDisplay:'symbol'} and we will get "€1,000.35"
 * If the page locale is "fr-FR", with the same options, we will get: "1 000,35 €"
 * </p>
 * @property {string=} options.currencyDisplay - if the number is using currency formatting, specifies 
 * if the currency will be displayed using its "code" (as an ISO 4217 alphabetic currency code), 
 * "symbol" (a localized currency symbol (e.g. $ for US dollars, £ for Great British pounds, and so 
 * on), or "name" (a localized currency name. Allowed values are "code", "symbol" and "name". 
 * The default is "symbol".
 * @property {string=} options.decimalFormat -
 * specifies the decimal format length to use when style is set to "decimal". 
 * Allowed values are : "standard"(default), "short" and "long". "standard" is equivalent to not 
 * specifying the 'decimalFormat' attribute, in that case the locale's default decimal pattern 
 * is used for formatting.
 * <p>
 * The user can also specify 'minimumFractionDigits' and  'maximumFractionDigits' to display. 
 * When not present we use the locale's default max and min fraction digits.
 * </p>
 * <p>
 * There is no need to specify the scale; we automatically detect greatest scale that is less or 
 * equal than the input number. For example  1000000 is formatted as "1M" or "1 million" and
 * 1234 is formatted, with zero fractional digits, as "1K" or " 1 thousand" for 
 * short and long formats respectively. The pattern for the short and long number is locale dependent 
 * and uses plural rules for the particular locale.
 * </p>
 * <p>
 * NOTE: Currently this option formats a value (e.g., 2000 -> 2K), but it does not parse a value 
 * (e.g., 2K -> 2000), so it can only be used
 * in a readOnly EditableValue because readOnly EditableValue components do not call
 * the converter's parse function.
 * </p>
 * @property {number=} options.minimumIntegerDigits - sets the minimum number of digits before the 
 * decimal place (known as integer digits). The number is padded with leading zeros if it would not 
 * otherwise have enough digits. The value must be an integer between 1 and 21.
 * @property {number=} options.minimumFractionDigits - similar to 'minimumIntegerDigits', except it 
 * deals with the digits after the decimal place (fractional digits). It must be an integer between 
 * 0 and 20. The fractional digits will be padded with trailing zeros if they are less than the minimum.
 * @property {number=} options.maximumFractionDigits - follows the same rules as 'minimumFractionDigits', 
 * but sets the maximum number of fractional digits that are allowed. The value will be rounded if 
 * there are more digits than the maximum specified.
 * @property {boolean=} options.useGrouping - when the value is truthy, the locale dependent grouping 
 * separator is used when formatting the number. This is often known as the thousands separator, 
 * although it is up to the locale where it is placed. The 'useGrouping' is set to true by default.
 * @property {string=} options.pattern an optional localized pattern, where the characters used in 
 * pattern are as defined in the Unicode CLDR for numbers, percent or currency formats. When present 
 * this will override the other "options". <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a currency style the 'currency' property is required to 
 * be set, as not setting this will throw an error. The 'currencyDisplay' is optional. <br/>Example: 
 * {pattern: '¤#,##0', currency: 'USD'}. <p>
 * 
 * &nbsp;&nbsp;- It's not mandatory for the pattern to have the special character '¤' (currency sign) 
 * be present. When not present, values are treated as a currency value, but are not formatted to 
 * show the currency symbol. <br/>Example: {pattern: '#,##0', currency: 'USD'} <p>
 * 
 * &nbsp;&nbsp;- When the pattern represents a percent style, the percent special character ('%') needs to be 
 * explicitly specified in the pattern, e.g., {pattern: "#,##0%"}. If the pattern does not contain 
 * the percent character it's treated as a decimal pattern, unless the style is set to percent, 
 * in which case the value is treated as a percent value, but not formatted to show the percent symbol. 
 * <br/>Example: {style: 'percent', pattern: "#,##0"}. <p>
 * 
 * &nbsp;&nbsp;- A decimal pattern or exponent pattern is specified in the pattern using the CLDR 
 * conventions. <br/>Example: {pattern: "#,##0.00"} or {pattern: "0.##E+0"}. <p>
 * 
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a pattern will override the default 
 * locale specific format. <br/>
 * 
 * @property {string=} options.roundingMode - specifies the rounding behavior. 
 * This follows the Java.Math.RoundingMode behavior.
 * Currently we support the options: HALF_UP, HALF_DOWN, and HALF_EVEN 
 * 
 * @property {boolean=} options.roundDuringParse - Specifies whether or not to round during
 * parse. Defaults to false; the number converter rounds during format but not during parse.
 * 
 * @example <caption>Create a number converter for currencies</caption>
 * var converter = OraNumberConveter.getInstance();
 * var options = {style: "currency", currency: "USD", minimumIntegerDigits: 2};
 * var localeElements;
 * var nb = 9;
 * converter.format(nb, localeElements, options); --> "$09.00" if page locale is 'en-US'
 * converter.format(nb, localeElements, options); --> "09,00 $US" if page locale is 'fr-FR'<br/>
 * 
 * @example <caption>Options for percent values using a custom (CLDR) pattern</caption>
 * var options = {pattern: '#,##0%'};
 *converter = converterFactory.createConverter(options);<br/>
 * 
 * @example <caption>To parse a value as percent but format it without displaying the percent character</caption>
 * var options = {style: 'percent', pattern: '#,##0'};<br/>
 * 
 * @example <caption>To parse a value as currency using a custom (CLDR) pattern</caption>
 * var options = {pattern: '¤#,##0', currency: 'USD'};
 * 
 * @example <caption>The following decimalFormat examples are in en locale.
 * To format a value as short (default for fraction digits is based on the locale)</caption>
 * var options = {style:'decimal', decimalFormat:'short'};
 * var nb = 12345
 * converter.format(nb, localeElements, options);--> 12.354K<br/>
 * 
 * @example <caption>To format a value as long (default for fraction digits is based on the locale):</caption>
 * var options = {style:'decimal', decimalFormat:'long'};
 * var nb = 12345;
 * converter.format(nb, localeElements, options);--> 12.345 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum fraction digits:</caption>
 * options = { style:'decimal', decimalFormat:'short', minimumFractionDigits:4};
 * var nb = 1234;
 * converter.format(nb, localeElements, options);--> 1.2340K<br/>
 * 
 * @example <caption>To format a value as short with maximum fraction digits:</caption>
 * options = { style:'decimal', decimalFormat:'short', maximumFractionDigits:0};
 *  var nb = 1234;
 * converter.format(nb, localeElements, options);--> 12K<br/>
 * 
 * @example <caption>To format a value as long with minimum and maximum fraction digits:</caption>
 * options = { style:'decimal', decimalFormat:'long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * var nb = 12000;
 * converter.format(nb, localeElements, options);--> 12.00 thousand<br/>
 * 
 * @example <caption>To format a value as short with minimum and maximum fraction digits:</caption>
 * options = { style:'decimal', decimalFormat:'long', 
 * minimumFractionDigits:2, maximumFractionDigits:4};
 * var nb = 12345678;
 * converter.format(nb, localeElements, options);--> 12.345 million<br/>
 * 
 * @example <caption>decimal style default is standard:</caption>
 * options = { style:'decimal', decimalFormat:'standard'}; 
 * var nb = 12345;
 * converter.format(nb, localeElements, options);--> 12,345<br/>
 * 
 * @example <caption>decimal round HALF_DOWN:</caption>
 * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_DOWN'}; 
 * var nb = 0.225;
 * converter.format(nb, localeElements, options);--> 0.22
 * var str = "0.225";
 * converter.parse(str, localeElements, options);-->0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_UP:</caption>
 * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_UP'}; 
 * var nb = 0.225;
 * converter.format(nb, localeElements, options);--> 0.23
 * var str = "0.225";
 * converter.parse(str, localeElements, options);--> 0.225 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_EVEN:</caption>
 * options = { style:'decimal',  maximumFractionDigits:2, roundingMode:'HALF_EVEN'}; 
 * converter.format(0.225, localeElements, options);--> 0.22
 * converter.format(0.235, localeElements, options);--> 0.24
 * converter.parse("0.225", localeElements, options);--> 0.225 //doesn't round during parse by default
 * converter.parse("0.235", localeElements, options);--> 0.235 //doesn't round during parse by default<br/>
 * 
 * @example <caption>decimal round HALF_DOWN and roundDuringParse:</caption>
 * options = { style:'decimal', maximumFractionDigits:2, 
 *             roundingMode:'HALF_DOWN', roundDuringParse: true};
 * var nb = 0.225; 
 * converter.format(nb, localeElements, options);--> 0.22
 * var str = "0.225";
 * converter.parse(str, localeElements, options);-->0.22<br/>
 * 
 * @example <caption>decimal round HALF_UP and roundDuringParse:</caption>
 * options = { style:'decimal',  maximumFractionDigits:2, 
 *             roundingMode:'HALF_UP', roundDuringParse: true}; 
 * var nb = 0.225;
 * converter.format(nb, localeElements, options);--> 0.23
 * var str = "0.225";
 * converter.parse(str, localeElements, options);--> 0.23<br/>
 * 
 * @example <caption>decimal round HALF_EVEN and roundDuringParse:</caption>
 * options = { style:'decimal',  maximumFractionDigits:2, 
 *             roundingMode:'HALF_EVEN', roundDuringParse: true}; 
 * converter.format(0.225, localeElements, options);--> 0.22
 * converter.format(0.235, localeElements, options);--> 0.24
 * converter.parse("0.225", localeElements, options);--> 0.22
 * converter.parse("0.235", localeElements, options);--> 0.24<br/>
 * 
 * @name OraNumberConverter
 */

/**
 * @ignore
 */
var OraNumberConverter;

OraNumberConverter = (function () {
  var _zeroPad;
  var _formatNumberImpl;
  var _parseNumberImpl;
  var _getLatnDigits;
  var _getNumberParts;
  var _throwNaNException;
  var _applyPatternImpl;
  var _parseNegativePattern;
  var _lenientParseNumber;
  var _parseNegativeExponent;
  var _getNumberSettings;
  var _validateNumberOptions;
  var _getRoundedNumber;
  var _throwMissingCurrency;
  var _getNumberingSystemKey;
  var _getBCP47Lang;
  var _throwNumberOutOfRange;
  var _roundNumber;
  var _decimalAdjust;
  var _getRoundingMode;
  var _getNumberOption;
  var _getNumberingExtension;
  var _adjustRoundingMode;
  var _getParsedValue;
  var _throwUnsupportedParseOption;
  var _toRawFixed;
  var _toExponentialPrecision;
  var _toCompactNumber;
  var instance;
  var _regionMatches;
  var _expandAffix;
  var _expandAffixes;
  var _throwSyntaxError;
  var _resolveNumberSettings;
  var _resolveOptions;

  var _REGEX_INFINITY = /^[+\-]?infinity$/i;
  var _REGEX_PARSE_FLOAT = /^[+\-]?\d*\.?\d*(e[+\-]?\d+)?$/;
  var _LENIENT_REGEX_PARSE_FLOAT = /([^+-.0-9]*)([+\-]?\d*\.?\d*(E[+\-]?\d+)?).*$/;
  var _ESCAPE_REGEXP = /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g;
  var _REGEX_TRIM_ZEROS = /(^0\.0*)([^0].*$)/;

  var _decimalTypeValues = {
    'trillion': [100000000000000, 10000000000000, 1000000000000],
    'billion': [100000000000, 10000000000, 1000000000],
    'million': [100000000, 10000000, 1000000],
    'thousand': [100000, 10000, 1000]
  };

  var _decimalTypeValuesMap = {
    'trillion': 1000000000000,
    'billion': 1000000000,
    'million': 1000000,
    'thousand': 1000
  };

  //maps roundingMode attributes to Math rounding modes. 
  var _roundingModeMap = {
    'HALF_UP': 'ceil',
    'HALF_DOWN': 'floor',
    'DEFAULT': 'round'
  };

  //prepend or append count zeros to a string.
  _zeroPad = function (str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
      str = (left ? ("0" + str) : (str + "0"));
    }
    return str;
  };

  _throwNumberOutOfRange = function (value, minimum, maximum, property) {
    var msg = value +
        " is out of range.  Enter a value between " + minimum +
        " and " + maximum + " for " + property;
    var rangeError = new RangeError(msg);
    var errorInfo = {
      'errorCode': "numberOptionOutOfRange",
      'parameterMap': {
        'value': value,
        'minValue': minimum,
        'maxValue': maximum,
        'propertyName': property
      }
    };
    rangeError['errorInfo'] = errorInfo;
    throw rangeError;
  };

  _getNumberOption = function (options, property, minimum, maximum, fallback) {
    var value = options[property];
    if (value !== undefined) {
      value = Number(value);
      if (isNaN(value) || value < minimum || value > maximum) {
        _throwNumberOutOfRange(value, minimum, maximum, property);
      }
      return Math.floor(value);
    }
    else {
      return fallback;
    }
  };

  //get the numbering system key from the locale's unicode extension.
  //Verify that the locale data has a numbers entry for it, if not return latn as default.
  _getNumberingSystemKey = function (localeElements, locale) {
    if (locale === undefined)
      return 'latn';
    var numberingSystemKey = _getNumberingExtension(locale);
    var symbols = "symbols-numberSystem-" + numberingSystemKey;
    if (localeElements['numbers'][symbols] === undefined)
      numberingSystemKey = 'latn';
    return numberingSystemKey;
  };

  //return the language part
  _getBCP47Lang = function (tag) {
    var arr = tag.split("-");
    return arr[0];
  };

  //get the unicode numbering system extension.
  _getNumberingExtension = function (locale) {
    locale = locale || "en-US";
    var idx = locale.indexOf("-u-nu-");
    var numbering = 'latn';
    if (idx !== -1) {
      numbering = locale.substr(idx + 6, 4);
    }
    return numbering;
  };

  /*return the properties for a number such as minimum and maximum fraction 
   *digits, decimal separator, grouping separator.
   *-If no user defined pattern is provided, get the pattern from the locale
   *  data and parse it to extrcat the number properties. If ecma options are
   *  present, override the corresponding default properties.
   *-If a user defined pattern is provided, parse it and extrcat the number
   *  properties. Ignore ecma ptions if present.
   */

  _getNumberSettings = function (localeElements, numberSettings,
      options, locale) {
    var pat;
    var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var numberingSystemKey = _getNumberingSystemKey(localeElementsMainNode, locale);
    numberSettings['numberingSystemKey'] = numberingSystemKey;
    numberSettings['numberingSystem'] = "symbols-numberSystem-" +
        numberingSystemKey;

    //pattern passed in options
    if (options['pattern'] !== undefined && options['pattern'].length > 0) {
      pat = options['pattern'];
    }
    else
    {
      var key;
      switch (options['style'])
      {
        case "decimal" :
          key = "decimalFormats-numberSystem-";
          break;
        case "currency" :
          key = "currencyFormats-numberSystem-";
          break;
        case "percent" :
          key = "percentFormats-numberSystem-";
          break;
        default:
          key = "decimalFormats-numberSystem-";
          break;
      }
      key += numberSettings['numberingSystemKey'];
      pat = localeElementsMainNode['numbers'][key]['standard'];
      var decFormatLength = options['decimalFormat'];
      if (decFormatLength !== undefined && options['style'] === 'decimal') {
        numberSettings['shortDecimalFormat'] = localeElementsMainNode['numbers']['decimalFormats-numberSystem-latn'][decFormatLength]['decimalFormat'];
      }
    }
    var mainNodeKey = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var lang = _getBCP47Lang(mainNodeKey);
    numberSettings['plurals'] = localeElements['supplemental']['plurals'];
    numberSettings['lang'] = lang;
    numberSettings['pat'] = pat;
    numberSettings['minusSign'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['minusSign'];
    numberSettings['decimalSeparator'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['decimal'];
    numberSettings['exponential'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['exponential'];
    numberSettings['groupingSeparator'] = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['group'];
    numberSettings['currencyDisplay'] = options['currencyDisplay'];
    if (options['currency'] !== undefined)
      numberSettings['currencyCode'] = options['currency'].toUpperCase();
    numberSettings['style'] = options['style'];
    _applyPatternImpl(options, pat, localeElementsMainNode, numberSettings);
    if (options['pattern'] === undefined) {
      numberSettings['minimumIntegerDigits'] = _getNumberOption(options,
          'minimumIntegerDigits', 1, 21,
          numberSettings['minimumIntegerDigits']);
      if (options['maximumFractionDigits'] !== undefined) {
        numberSettings['maximumFractionDigits'] = _getNumberOption(options,
            'maximumFractionDigits', 0, 20, numberSettings['maximumFractionDigits']);
        if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
          numberSettings['minimumFractionDigits'] = numberSettings['maximumFractionDigits'];
        }
      }
      if (options['minimumFractionDigits'] !== undefined) {
        numberSettings['minimumFractionDigits'] = _getNumberOption(options,
            'minimumFractionDigits', 0, 20,
            numberSettings['minimumFractionDigits']);
      }
      if (numberSettings['maximumFractionDigits'] < numberSettings['minimumFractionDigits']) {
        numberSettings['maximumFractionDigits'] = numberSettings['minimumFractionDigits'];
      }
    }
  };

  _throwMissingCurrency = function (prop) {
    var typeError = new TypeError('The property "currency" is required when' +
        'the property "' + prop + '" is "currency". An accepted value is a ' +
        'three-letter ISO 4217 currency code.');
    var errorInfo = {
      'errorCode': 'optionTypesMismatch',
      'parameterMap': {
        'propertyName': prop, // the driving property
        'propertyValue': 'currency', // the driving property's value
        'requiredPropertyName': 'currency', // the required property name
        'requiredPropertyValueValid': 'a three-letter ISO 4217 currency code'
      }
    };
    typeError['errorInfo'] = errorInfo;
    throw typeError;
  };

  _throwUnsupportedParseOption = function () {
    var error, errorInfo,
        code = "unsupportedParseFormat",
        msg = "long and short decimalFormats are not supported for parsing";
    error = new Error(msg);
    errorInfo = {
      'errorCode': code,
      'parameterMap': {
        'value': 'decimal'
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  //If the user specifies currency as a style, currency option must also be
  // provided. parse does not support short and long decimalFormat.
  _validateNumberOptions = function (options, caller) {
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var s = getOption('style', 'string', ['currency', 'decimal', 'percent', 'perMill'],
        'decimal');
    if (s === 'decimal') {
      s = getOption('decimalFormat', 'string', ['standard', 'short', 'long']);
      if (caller === 'OraNumberConverter.parse' && s !== undefined && s !== 'standard') {
        _throwUnsupportedParseOption();
      }
    }
    var c = getOption('currency', 'string');
    if (s === 'currency' && c === undefined) {
      _throwMissingCurrency("style");
    }
    var roundingMode = getOption('roundingMode', 'string', ['HALF_UP', 'HALF_DOWN', 'HALF_EVEN'],
        'DEFAULT');
  };

  //_toCompactNumber does compact formatting like 3000->3K for short
  //and "3 thousand" for long
  _toCompactNumber = function (number, options, numberSettings) {

    function _getZerosInPattern(s) {
      var i = 0, n = 0, idx = 0, prefix = '';
      if (s[0] !== '0') {
        while (s[i] !== '0' && i < s.length) {
          i++;
        }
        prefix = s.substr(0, i);
        idx = i;
      }
      for (i = idx; i < s.length; i++) {
        if (s[i] === '0')
          n++;
        else
          break;
      }
      return [prefix, n];
    }

    /* To format a number N, the greatest type less than or equal to N is used, with
     * the appropriate plural category. N is divided by the type, after removing the
     * number of zeros in the pattern, less 1.
     * APIs supporting this format should provide control over the number of
     * significant or fraction digits.
     *Thus N=12345 matches <pattern type="10000" count="other">00 K</pattern>.
     *N is divided by 1000 (obtained from 10000 after removing "00" and restoring
     *one "0". The result is formatted according to the normal decimal pattern.
     *With no fractional digits, that yields "12 K".
     */
    function _matchTypeValue(n) {
      var i, j, len;
      for (i in _decimalTypeValues) {
        len = _decimalTypeValues[i].length;
        for (j = 0; j < len; j++) {
          if (_decimalTypeValues[i][j] <= n)
            return [i, _decimalTypeValues[i][j]];
        }
      }
      return [n, null];
    }


    var typeVal = _matchTypeValue(number);
    var prefix = '';
    if (typeVal[1] !== null) {
      var lang = numberSettings['lang'];
      var plural = numberSettings['plurals'][lang](Math.floor(number / _decimalTypeValuesMap[typeVal[0]]));
      var decimalFormatType = "" + typeVal[1] + "-count-" + plural;
      decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      if (decimalFormatType === undefined) {
        plural = "other";
        decimalFormatType = "" + typeVal[1] + "-count-" + plural;
        decimalFormatType = numberSettings['shortDecimalFormat'][decimalFormatType];
      }
      var tokens = _getZerosInPattern(decimalFormatType);
      var zeros = tokens[1];
      prefix = tokens[0];
      if (zeros < decimalFormatType.length) {
        var i = (1 * Math.pow(10, zeros));
        i = (typeVal[1] / i) * 10;
        number = number / i;
      }
    }
    var s = "";
    var fmt;
    if (decimalFormatType !== undefined)
      s = decimalFormatType.substr(zeros + tokens[0].length);
    fmt = _toRawFixed(number, options, numberSettings);
    s = prefix + fmt + s;
    return s;
  };

  //_toExponentialPrecision does the formatting when the pattern contain E,
  //for example #.#E0  
  _toExponentialPrecision = function (number, numberSettings) {
    var numStr0 = number + "";
    var trimExp = 0;
    var split = numStr0.split(/e/i);
    var numStr = split[0];
    _REGEX_TRIM_ZEROS.lastIndex = 0;
    var match = _REGEX_TRIM_ZEROS.exec(numStr);
    if (match !== null) {
      trimExp = match[1].length - 1;
      numStr = match[2];
    }
    else {
      numStr = numStr.replace(".", "");
    }
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    var numStr1 = parseInt(numStr, 10);
    var len = numberSettings['minimumIntegerDigits'] + numberSettings['maximumFractionDigits'];
    if (numStr.length > len) {
      len -= numStr.length;
      var factor = Math.pow(10, len);
      numStr1 = Math.round(numStr1 * factor);
    }
    var padLen = numberSettings['minimumIntegerDigits'] + numberSettings['minimumFractionDigits'];
    numStr1 = numStr1 + "";
    numStr1 = _zeroPad(numStr1, padLen, false);
    if (numStr0.indexOf('.') !== -1) {
      exponent -= numberSettings['minimumIntegerDigits'] - numStr0.indexOf('.') + trimExp;
    }
    else {
      exponent -= padLen - numStr.length - numberSettings['minimumFractionDigits'];
    }
    var posExp = Math.abs(exponent);
    posExp = _zeroPad(posExp + "", numberSettings['minExponentDigits'], true);
    if (exponent < 0)
      posExp = numberSettings['minusSign'] + posExp;
    var str1 = numStr1.slice(0, numberSettings['minimumIntegerDigits']);
    var str2 = numStr1.slice(numberSettings['minimumIntegerDigits']);
    if (str2.length > 0) {
      str1 += numberSettings['decimalSeparator'] + numStr1.slice(numberSettings['minimumIntegerDigits']) +
          numberSettings['exponential'] + posExp;
    }
    else {
      str1 += numberSettings['exponential'] + posExp;
    }
    return str1;
  };

  //_toRawFixed does the formatting based on
  //minimumFractionDigits and maximumFractionDigits.
  _toRawFixed = function (number, options, numberSettings) {
    var curSize = numberSettings['groupingSize'];
    var curSize0 = numberSettings['groupingSize0'];
    //First round the number based on maximumFractionDigits
    var numberString = number + "";
    var split = numberString.split(/e/i);
    var exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    var right = split.length > 1 ? split[ 1 ] : "";
    //round the number only if it has decimal points
    if (split.length > 1 && right.length > exponent)
    {
      var precision = Math.min(numberSettings['maximumFractionDigits'],
          right.length - exponent);
      var mode = options['roundingMode'] || 'DEFAULT';
      number = _roundNumber(number, precision, mode);
    }
    //split the number into integer, fraction and exponent parts.
    numberString = number + "";
    split = numberString.split(/e/i);
    exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
    numberString = split[ 0 ];
    split = numberString.split('.');
    numberString = split[ 0 ];
    right = split.length > 1 ? split[ 1 ] : "";
    //pad zeros based on the exponent value and minimumFractionDigits 
    if (exponent > 0) {
      right = _zeroPad(right, exponent, false);
      numberString += right.slice(0, exponent);
      right = right.substr(exponent);
    }
    else if (exponent < 0) {
      exponent = -exponent;
      numberString = _zeroPad(numberString, exponent + 1, true);
      right = numberString.slice(-exponent, numberString.length) + right;
      numberString = numberString.slice(0, -exponent);
    }
    if (precision > 0) {
      right = numberSettings['decimalSeparator'] +
          ((right.length > precision) ? right.slice(0, precision) :
              _zeroPad(right, precision, false));
    }
    else {
      if (numberSettings['minimumFractionDigits'] > 0) {
        right = numberSettings['decimalSeparator'];
      }
      else {
        right = "";
      }
    }
    //insert grouping separator in the integer part based on groupingSize
    var padLen = numberSettings['decimalSeparator'].length +
        numberSettings['minimumFractionDigits'];
    right = _zeroPad(right, padLen, false);
    var sep = numberSettings['groupingSeparator'],
        ret = "";
    if (options['useGrouping'] === false && options['pattern'] === undefined)
      sep = '';
    numberString = _zeroPad(numberString,
        numberSettings['minimumIntegerDigits'], true);
    var stringIndex = numberString.length - 1;
    right = right.length > 1 ? right : "";
    var rets;
    while (stringIndex >= 0) {
      if (curSize === 0 || curSize > stringIndex) {
        rets = numberString.slice(0, stringIndex + 1) +
            (ret.length ? (sep + ret + right) : right);
        return rets;
      }
      ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) +
          (ret.length ? (sep + ret) : "");
      stringIndex -= curSize;
      if (curSize0 > 0) {
        curSize = curSize0;
      }
    }
    rets = numberString.slice(0, stringIndex + 1) + sep + ret + right;
    return rets;
  };

  //HALF_DOWN behaves as HALF_UP if the discarded fraction is > 0.5
  _adjustRoundingMode = function (value, maxDigits, mode) {
    if (mode === 'HALF_DOWN' || mode === 'HALF_EVEN') {
      var n = value.substr(maxDigits);
      n = parseInt(n, 10);
      if (n > 5)
        mode = 'HALF_UP';
    }
    return mode;
  };

  _roundNumber = function (value, scale, mode) {
    var parts = value.toString().split('.');
    if (parts[1] === undefined)
      return value;
    if (parts[1][scale] === '5' && mode !== 'DEFAULT') {
      var adjustedMode = _adjustRoundingMode(parts[1], scale, mode);
      adjustedMode = _getRoundingMode(parts, adjustedMode, scale);
      return _decimalAdjust(value, -scale, adjustedMode, parts);
    }
    else {
      var factor = Math.pow(10, scale),
          rounded = Math.round(value * factor) / factor;
      if (!isFinite(rounded)) {
        return value;
      }
      return rounded;
    }
  };

  _getRoundingMode = function (parts, rMode, scale) {
    var mode = _roundingModeMap[rMode];
    if (rMode === 'HALF_EVEN') {
      var c;
      if (scale === 0) {
        var len = parts[0].length;
        c = parseInt(parts[0][len - 1], 10);
      }
      else {
        c = parseInt(parts[1][scale - 1], 10);
      }
      if (c % 2 == 0) {
        mode = _roundingModeMap['HALF_DOWN'];
      }
      else {
        mode = _roundingModeMap['HALF_UP']
      }
    }
    return mode;
  };

  /**
   * This function does the actual rounding of the number based on the rounding
   * mode:
   * value is the number to be rounded.
   * scale is the maximumFractionDigits.
   * mode is the rounding mode: ceil, floor, round. 
   * parts is the integer and fraction parts of the value.
   */
  _decimalAdjust = function (value, scale, mode, parts) {
    if (scale === 0) {
      if (parts[1][0] === '5') {
        return Math[mode](value);
      }
      return Math['round'](value);
    }
    var strValue = value.toString().split('e');
    var v0 = strValue[0];
    var v1 = strValue[1];
    //shift the decimal point based on the scale so that we can apply ceil or floor
    //scale is a number, no need to parse it, just parse v1.
    var s = v0 + 'e' + (v1 ? (parseInt(v1, 10) - scale) : -scale);
    var num = parseFloat(s);
    value = Math[mode](num);
    strValue = value.toString().split('e');
    //need to extract v0 and v1 again because value has chnaged after applying Math[mode].
    v0 = strValue[0];
    v1 = strValue[1];
    //shift the decimal point back to its original position
    s = v0 + 'e' + (v1 ? (parseInt(v1, 10) + scale) : scale);
    num = parseFloat(s);
    return num;
  };

  //first call _toRawFixed then add prefixes and suffixes. Display the 
  //number using native digits based on the numbering system
  _formatNumberImpl = function (value, options, localeElements,
      numberSettings, locale) {
    var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    if (!isFinite(value)) {
      if (value === Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      if (value === -Infinity) {
        return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['infinity'];
      }
      return localeElementsMainNode['numbers'][numberSettings['numberingSystem']]['nan'];
    }
    var number = Math.abs(value);
    if (numberSettings['isPercent'] === true ||
        options['style'] === 'percent')
      number *= 100;
    else if (numberSettings['isPerMill'] === true)
      number *= 1000;

    //expand the number
    if ((options['style'] === 'decimal')
        && options['decimalFormat'] !== undefined
        && options['decimalFormat'] !== 'standard')
      number = _toCompactNumber(number, options, numberSettings);
    else if (numberSettings['useExponentialNotation'] === true)
      number = _toExponentialPrecision(number, numberSettings);
    else
      number = _toRawFixed(number, options, numberSettings);
    var ret = "";
    //add negative prefix and suffix if number is negative
    if (value < 0) {
      ret += numberSettings['negativePrefix'] + number +
          numberSettings['negativeSuffix'];
    }
    //add positive prefix and suffix if number is positive
    else {
      ret += numberSettings['positivePrefix'] + number +
          numberSettings['positiveSuffix'];
    }
    //display the digits based on the numbering system
    var numberingSystemKey = _getNumberingExtension(locale);
    if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      numberingSystemKey = 'latn';
    if (numberingSystemKey !== 'latn') {
      var idx;
      var nativeRet = [];
      for (idx = 0; idx < ret.length; idx++)
      {
        if (ret[idx] >= '0' && ret[idx] <= '9')
          nativeRet.push(OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
        else
          nativeRet.push(ret[idx]);

      }
      return nativeRet.join("");
    }
    return ret;
  };

  //remove prefix and suffix, return a sign and value. First try to extract
  //a number using exact match. If it fails try lenient parsing.
  _parseNegativePattern = function (value, options, numberSettings,
      localeElements) {
    var ret, num = OraI18nUtils.trimNumber(value);
    var sign = "";
    var exactMatch = false;
    var posSign = localeElements['numbers'][numberSettings['numberingSystem']]['plusSign'];
    var posSignRegExp = new RegExp("^" + posSign.replace(_ESCAPE_REGEXP, "\\$1"));
    num = num.replace(posSignRegExp, "");
    var nbSettingPosPrefix = OraI18nUtils.trimNumber(numberSettings['positivePrefix']),
        nbSettingPosSuffix = OraI18nUtils.trimNumber(numberSettings['positiveSuffix']),
        nbSettingNegPrefix = OraI18nUtils.trimNumber(numberSettings['negativePrefix']),
        nbSettingNegSuffix = OraI18nUtils.trimNumber(numberSettings['negativeSuffix']);
    //try exact match of negative prefix and suffix
    var posPrefRegexp = new RegExp("^" + (nbSettingPosPrefix ||
        "").replace(_ESCAPE_REGEXP, "\\$1"));
    var posSuffRegexp = new RegExp((nbSettingPosSuffix || "").
        replace(_ESCAPE_REGEXP, "\\$1") + "$");
    var negPrefRegexp = new RegExp("^" + (nbSettingNegPrefix ||
        "").replace(_ESCAPE_REGEXP, "\\$1"));
    var negSuffRegexp = new RegExp((nbSettingNegSuffix ||
        "").replace(_ESCAPE_REGEXP, "\\$1") + "$");

    if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
      num = num.replace(negPrefRegexp, "");
      num = num.replace(negSuffRegexp, "");
      sign = "-";
      exactMatch = true;
    }
    //try exact match of positive prefix and suffix
    else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
      num = num.replace(posPrefRegexp, "");
      num = num.replace(posSuffRegexp, "");
      sign = "+";
      exactMatch = true;
    }
    //if style is currency, remove currency symbol from prefix and suffix 
    //and try a match
    else if (options['style'] === 'currency') {
      var code = numberSettings['currencyCode'], symbol = code;
      var posPrefix, posSuffix, negPrefix, negSuffix, repStr;
      if (localeElements['numbers']['currencies'][code] !== undefined) {
        symbol = localeElements['numbers']['currencies'][code]['symbol'];
      }
      if (numberSettings['currencyDisplay'] === undefined ||
          numberSettings['currencyDisplay'] === "symbol") {
        repStr = symbol;
      }
      else if (numberSettings['currencyDisplay'] === "code") {
        repStr = code;
      }
      if (repStr !== undefined) {
        posPrefix = (nbSettingPosPrefix || "").replace(
            repStr, "");
        posSuffix = (nbSettingPosSuffix || "").replace(
            repStr, "");
        negPrefix = (nbSettingNegPrefix || "").replace(
            repStr, "");
        negSuffix = (nbSettingNegSuffix || "").replace(
            repStr, "");
        posPrefRegexp = new RegExp(("^" + posPrefix).replace(
            _ESCAPE_REGEXP, "\\$1"));
        posSuffRegexp = new RegExp(posSuffix.replace(
            _ESCAPE_REGEXP, "\\$1") + "$");
        negPrefRegexp = new RegExp(("^" + negPrefix).replace(
            _ESCAPE_REGEXP, "\\$1"));
        negSuffRegexp = new RegExp(negSuffix.replace(
            _ESCAPE_REGEXP, "\\$1") + "$");

        //try  match of positive prefix and suffix
        if (negPrefRegexp.test(num) === true && negSuffRegexp.test(num) === true) {
          num = num.replace(negPrefRegexp, "");
          num = num.replace(negSuffRegexp, "");
          sign = "-";
          exactMatch = true;
        }
        //try exact match of positive prefix and suffix
        else if (posPrefRegexp.test(num) === true && posSuffRegexp.test(num) === true) {
          num = num.replace(posPrefRegexp, "");
          num = num.replace(posSuffRegexp, "");
          sign = "+";
          exactMatch = true;
        }
      }
    }
    if (!exactMatch) {
      ret = _lenientParseNumber(num, numberSettings, localeElements);
      ret[2] = true;
    }
    else
      ret = [sign, num];
    return ret;
  };

  _lenientParseNumber = function (num, numberSettings, localeElements) {
    // Try to extract the number accoring to the following pattern:
    // optional +- followed by one or many digits followed by optional
    // fraction part followed by optional exponential.
    // use localized +, -, decimal separator, exponential
    // [+-]?\d+(?:\.\d+)?(?:E[+-]?\d+)?/;
    //remove grouping deparator from string
    var groupingSeparator =
        localeElements['numbers'][numberSettings['numberingSystem']]['group'];
    var decimalSeparator =
        localeElements['numbers'][numberSettings['numberingSystem']]['decimal'];
    var localeMinusSign =
        localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
    var plusSign = "+";
    var minusSign = "-";
    var sign = "";
    var dot = "";
    var exponential =
        OraI18nUtils.toUpper(localeElements['numbers'][numberSettings['numberingSystem']]['exponential']);
    num = OraI18nUtils.toUpper(num);
    num = num.split(exponential).join("E");
    //remove grouping separator from string
    var groupSep = groupingSeparator;
    num = num.split(groupSep).join("");
    var altGroupSep = groupSep.replace(/\u00A0/g, " ");
    if (groupSep !== altGroupSep) {
      num = num.split(altGroupSep).join("");
    }
    num = num.split(decimalSeparator).join(".");
    if (num.charAt(0) === ".") {
      num = num.substr(1);
      dot = ".";
    }
    //replace localized minus with minus
    num = num.replace(localeMinusSign, minusSign);
    var match = _LENIENT_REGEX_PARSE_FLOAT.exec(num);
    var resNum = dot + match[2];
    if (OraI18nUtils.startsWith(resNum, minusSign)) {
      resNum = resNum.substr(minusSign.length);
      sign = "-";
    }
    else if (OraI18nUtils.startsWith(num, plusSign)) {
      resNum = resNum.substr(plusSign.length);
      sign = "+";
    }
    return [sign, resNum];
  };

  //parse the exponent part of a number
  _parseNegativeExponent = function (value, localeElements, numberSettings) {
    var neg = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'],
        pos = localeElements['numbers'][numberSettings['numberingSystem']]['plusSign'],
        ret;
    value = OraI18nUtils.trimNumber(value);
    neg = OraI18nUtils.trimNumber(neg);
    pos = OraI18nUtils.trimNumber(pos);
    if (OraI18nUtils.startsWith(value, neg)) {
      ret = ["-", value.substr(neg.length)];
    }
    else if (OraI18nUtils.startsWith(value, OraI18nUtils.trimNumber(pos))) {
      ret = ["+", value.substr(pos.length)];
    }
    return ret || ["", value];
  };

  _getLatnDigits = function (str, locale) {
    var numberingSystemKey = _getNumberingExtension(locale);
    if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      return str;
    var idx;
    var latnStr = [];
    for (idx = 0; idx < str.length; idx++) {
      var pos = OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
      if (pos !== -1)
        latnStr.push(pos);
      else
        latnStr.push(str[idx]);
    }
    var ret = latnStr.join("");
    return ret;
  };

  //split the number into integer, fraction and exponential parts
  _getNumberParts = function (num, numberSettings, localeElementsMainNode) {
    var parts = {};
    var decimalSeparator = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['decimal'];
    var groupSep = localeElementsMainNode['numbers']
    [numberSettings['numberingSystem']]['group'];
    num = num.replace(/ /g, "");
    // determine exponent and number
    var exponentSymbol = numberSettings['exponential'];
    var integer;
    var intAndFraction;
    var exponentPos = num.indexOf(exponentSymbol.toLowerCase());
    if (exponentPos < 0)
      exponentPos = num.indexOf(OraI18nUtils.toUpper(exponentSymbol));
    if (exponentPos < 0) {
      intAndFraction = num;
      parts['exponent'] = null;
    }
    else {
      intAndFraction = num.substr(0, exponentPos);
      parts['exponent'] = num.substr(exponentPos + exponentSymbol.length);
    }
    // determine decimal position
    var decSep = decimalSeparator;
    var decimalPos = intAndFraction.indexOf(decSep);
    if (decimalPos < 0) {
      integer = intAndFraction;
      parts['fraction'] = null;
    }
    else {
      integer = intAndFraction.substr(0, decimalPos);
      parts['fraction'] = intAndFraction.substr(decimalPos + decSep.length);
    }
    // handle groups (e.g. 1,000,000)
    integer = integer.split(groupSep).join("");
    var altGroupSep = groupSep.replace(/\u00A0/g, " ");
    if (groupSep !== altGroupSep) {
      integer = integer.split(altGroupSep).join("");
    }
    parts['integer'] = integer;
    return parts;
  };

  _getParsedValue = function (ret, options, numberSettings, errStr) {
    if (isNaN(ret)) {
      _throwNaNException(options['style'], numberSettings, errStr)
    }
    if (numberSettings['isPercent'] === true || options['style'] ===
        'percent')
      ret /= 100;
    else if (numberSettings['isPerMill'] === true)
      ret /= 1000;
    var getOption = OraI18nUtils.getGetOption(options, "OraNumberConverter.parse");
    var roundDuringParse = getOption('roundDuringParse', 'boolean', [true, false], false);
    if (roundDuringParse) {
      ret = _getRoundedNumber(ret, numberSettings, options);
    }
    return ret;
  };

  _throwNaNException = function (style, numberSettings, errStr) {
    var msg, error, errorInfo, code;
    msg = "Unparsable number " + errStr + " The expected number " +
        "pattern is " + numberSettings['pat'];
    switch (style)
    {
      case "decimal" :
        code = "decimalFormatMismatch";
        break;
      case "currency" :
        code = "currencyFormatMismatch";
        break;
      case "percent" :
        code = "percentFormatMismatch";
        break;
    }
    error = new Error(msg);
    errorInfo = {
      'errorCode': code,
      'parameterMap': {
        'value': errStr,
        'format': numberSettings['pat']
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  _parseNumberImpl = function (str, localeElements, options, locale) {
    var localeElementsMainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var numberSettings = {};
    var numStr = _getLatnDigits(str, locale);
    _getNumberSettings(localeElements, numberSettings, options, locale);
    var ret = NaN;
    var value1 = numStr.replace(/ /g, "");
    // allow infinity or hexidecimal
    if (_REGEX_INFINITY.test(value1)) {
      ret = parseFloat(numStr);
      return ret;
    }
    var signInfo = _parseNegativePattern(numStr, options, numberSettings,
        localeElementsMainNode);
    var sign = signInfo[ 0 ];
    var num = signInfo[ 1 ];
    sign = sign || "+";
    if (signInfo[2]) {
      ret = parseFloat(sign + num);
      return  _getParsedValue(ret, options, numberSettings, str);
    }

    var parts = _getNumberParts(num, numberSettings, localeElementsMainNode);
    var integer = parts['integer'];
    var fraction = parts['fraction'];
    var exponent = parts['exponent'];

    // build a natively parsable number string
    var p = sign + integer;
    if (fraction !== null) {
      p += "." + fraction;
    }
    if (exponent !== null) {
      // exponent itself may have a number pattern
      var expSignInfo = _parseNegativeExponent(exponent, localeElementsMainNode,
          numberSettings);
      p += "e" + (expSignInfo[0] || "+") + expSignInfo[ 1 ];
    }
    if (_REGEX_PARSE_FLOAT.test(p)) {
      ret = parseFloat(p);
    }
    else {
      p = _lenientParseNumber(numStr, numberSettings, localeElementsMainNode);
      ret = parseFloat(p[0] + p[1]);
    }
    return  _getParsedValue(ret, options, numberSettings, str);
  };

  /* This module handles the  parsing of a number pattern.
   * It sets prefix, suffix, minimum and maximum farcation digits, 
   * miimum  integer digits and grouping size. 
   */

  var _ZERO_DIGIT = '0',
      _GROUPING_SEPARATOR = ',',
      _DECIMAL_SEPARATOR = '.',
      _PERCENT = '%',
      _PER_MILL = '\u2030',
      _DIGIT = '#',
      _SEPARATOR = ';',
      _EXPONENT = "E",
      _MINUS = '-',
      _QUOT = '\'',
      _CURRENCY = '\u00A4';

  var posPrefixPattern,
      posSuffixPattern,
      negPrefixPattern,
      negSuffixPattern;

  var _MAXIMUM_INTEGER_DIGITS = 0x7fffffff;
  var _MAXIMUM_FRACTION_DIGITS = 0x7fffffff;

  _throwSyntaxError = function (pattern) {
    var msg, syntaxError, errorInfo, samplePattern = "#,##0.###";
    msg = "Unexpected character(s) encountered in the pattern \"" +
        pattern + " An example of a valid pattern is \"" + samplePattern +
        '".';
    syntaxError = new SyntaxError(msg);
    errorInfo = {
      'errorCode': 'optionValueInvalid',
      'parameterMap': {
        'propertyName': 'pattern',
        'propertyValue': pattern,
        'propertyValueHint': samplePattern
      }
    };
    syntaxError['errorInfo'] = errorInfo;
    throw syntaxError;
  };

  _regionMatches = function (str1, offset1, str2) {
    var sub1 = str1.substr(offset1, str2.length);
    var regExp = new RegExp(str2, "i");
    return (regExp.exec(sub1) !== null);
  };

  _expandAffixes = function (localeElements, numberSettings) {
    var curDisplay = {};
    if (posPrefixPattern !== null) {
      numberSettings['positivePrefix'] = _expandAffix(posPrefixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (posSuffixPattern !== null) {
      numberSettings['positiveSuffix'] = _expandAffix(posSuffixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (negPrefixPattern !== null) {
      numberSettings['negativePrefix'] = _expandAffix(negPrefixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (negSuffixPattern !== null) {
      numberSettings['negativeSuffix'] = _expandAffix(negSuffixPattern,
          localeElements, numberSettings, curDisplay);
    }
    if (curDisplay['name'] !== undefined) {
      numberSettings['positiveSuffix'] = "\u00a0" + curDisplay['name'];
      numberSettings['positivePrefix'] = "";
      if (numberSettings['lang'] === 'ar') {
        numberSettings['negativeSuffix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'] + "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = "";
      }
      else {
        numberSettings['negativeSuffix'] = "\u00a0" + curDisplay['name'];
        numberSettings['negativePrefix'] = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
      }
    }
  };

  _expandAffix = function (pattern, localeElements, numberSettings,
      currencyDisplay) {
    var buffer = "";
    for (var i = 0; i < pattern.length; ) {
      var c = pattern.charAt(i++);
      if (c === _QUOT)// {
        continue;
      //c = pattern.charAt(i++);
      switch (c) {
        case _CURRENCY:
          var code = numberSettings['currencyCode'];
          var name = code, symbol = code;
          if (localeElements['numbers']['currencies'][code] !== undefined) {
            name = localeElements['numbers']['currencies'][code]['displayName'];
            symbol = localeElements['numbers']['currencies'][code]['symbol'];
          }
          if (numberSettings['currencyDisplay'] === undefined ||
              numberSettings['currencyDisplay'] === "symbol")
            c = symbol;
          else if (numberSettings['currencyDisplay'] === "code") {
            c = code;
          }
          else {
            c = name;
            currencyDisplay['name'] = c;
          }
          break;
        case _PERCENT:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['percentSign'];
          break;
        case _PER_MILL:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['perMille'];
          break;
        case _MINUS:
          c = localeElements['numbers'][numberSettings['numberingSystem']]['minusSign'];
          break;
      }
      //}
      buffer = buffer.concat(c);
    }
    return buffer;
  };

  _applyPatternImpl = function (options, pattern, localeElements,
      numberSettings) {

    var gotNegative = false,
        useExponentialNotation = false;
    var phaseOneLength = 0;
    var start = 0;
    var isPrefix = true;

    for (var j = 1; j >= 0 && start < pattern.length; --j) {
      var inQuote = false;
      var prefix = "";
      var suffix = "";
      var decimalPos = -1;
      var multiplier = 1;
      var digitLeftCount = 0, zeroDigitCount = 0, digitRightCount = 0,
          groupingCount = -1, groupingCount0 = -1;
      var minExponentDigits;
      var phase = 0;

      isPrefix = true;
      for (var pos = start; pos < pattern.length; ++pos) {
        var ch = pattern.charAt(pos);
        switch (phase) {
          case 0:
          case 2:
            // Process the prefix / suffix characters
            if (inQuote) {
              if (ch === _QUOT) {
                if ((pos + 1) < pattern.length && pattern.charAt(pos + 1) ===
                    _QUOT) {
                  ++pos;
                  if (isPrefix)
                    prefix = prefix.concat("''");
                  else
                    suffix = suffix.concat("''");
                }
                else {
                  inQuote = false; // 'do'
                }
                continue;
              }
            }
            else {
              // Process unquoted characters seen in prefix or suffix phase.
              if (ch === _DIGIT ||
                  ch === _ZERO_DIGIT ||
                  ch === _GROUPING_SEPARATOR ||
                  ch === _DECIMAL_SEPARATOR) {
                phase = 1;
                --pos; // Reprocess this character
                continue;
              }
              else if (ch === _CURRENCY) {
                if (options['currency'] === undefined)
                  _throwMissingCurrency("pattern");
                // Use lookahead to determine if the currency sign
                // is doubled or not.
                options['style'] = 'currency';
                var doubled = (pos + 1) < pattern.length &&
                    pattern.charAt(pos + 1) === _CURRENCY;
                if (doubled) { // Skip over the doubled character
                  ++pos;
                }
                if (isPrefix)
                  prefix = prefix.concat(doubled ? "'\u00A4\u00A4" :
                      "'\u00A4");
                else
                  suffix = suffix.concat(doubled ? "'\u00A4\u00A4" :
                      "'\u00A4");
                continue;
              }
              else if (ch === _QUOT) {
                if (ch === _QUOT) {
                  if ((pos + 1) < pattern.length &&
                      pattern.charAt(pos + 1) === _QUOT) {
                    ++pos;
                    if (isPrefix)
                      prefix = prefix.concat("''");// o''clock
                    else
                      suffix = suffix.concat("''");
                  }
                  else {
                    inQuote = true; // 'do'
                  }
                  continue;
                }
              }
              else if (ch === _SEPARATOR) {
                if (phase === 0 || j === 0) {
                  _throwSyntaxError(pattern);
                }
                start = pos + 1;
                pos = pattern.length;
                continue;
              }

              // Next handle characters which are appended directly.
              else if (ch === _PERCENT) {
                options['style'] = 'percent';
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                numberSettings['isPercent'] = true;
                multiplier = 100;
                if (isPrefix)
                  prefix = prefix.concat("'%");
                else
                  suffix = suffix.concat("'%");
                continue;
              }
              else if (ch === _PER_MILL) {
                if (multiplier !== 1) {
                  _throwSyntaxError(pattern);
                }
                options['style'] = 'perMill';
                numberSettings['isPerMill'] = true;
                multiplier = 1000;
                if (isPrefix)
                  prefix = prefix.concat("'\u2030");
                else
                  suffix = suffix.concat("'\u2030");
                continue;
              }
              else if (ch === _MINUS) {
                if (isPrefix)
                  prefix = prefix.concat("'-");
                else
                  suffix = suffix.concat("'-");
                continue;
              }
            }
            if (isPrefix)
              prefix = prefix.concat(ch);
            else
              suffix = suffix.concat(ch);
            break;

          case 1:
            if (j === 1) {
              ++phaseOneLength;
            }
            else {
              if (--phaseOneLength === 0) {
                phase = 2;
                isPrefix = false;
              }
              continue;
            }

            if (ch === _DIGIT) {
              if (zeroDigitCount > 0) {
                ++digitRightCount;
              }
              else {
                ++digitLeftCount;
              }
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            }
            else if (ch === _ZERO_DIGIT) {
              if (digitRightCount > 0) {
                _throwSyntaxError(pattern);
              }
              ++zeroDigitCount;
              if (groupingCount >= 0 && decimalPos < 0) {
                ++groupingCount;
              }
            }
            else if (ch === _GROUPING_SEPARATOR) {
              groupingCount0 = groupingCount;
              groupingCount = 0;
            }
            else if (ch === _DECIMAL_SEPARATOR) {
              if (decimalPos >= 0) {
                _throwSyntaxError(pattern);
              }
              decimalPos = digitLeftCount + zeroDigitCount +
                  digitRightCount;
            }
            else if (_regionMatches(pattern, pos, _EXPONENT)) {
              if (useExponentialNotation) {
                _throwSyntaxError(pattern);
              }
              useExponentialNotation = true;
              minExponentDigits = 0;
              pos = pos + _EXPONENT.length;
              while (pos < pattern.length && pattern.charAt(pos) ===
                  _ZERO_DIGIT) {
                ++minExponentDigits;
                ++phaseOneLength;
                ++pos;
              }

              if ((digitLeftCount + zeroDigitCount) < 1 ||
                  minExponentDigits < 1) {
                _throwSyntaxError(pattern);
              }
              phase = 2;
              isPrefix = false;
              --pos;
              continue;
            }
            else {
              phase = 2;
              isPrefix = false;
              --pos;
              --phaseOneLength;
              continue;
            }
            break;
        }
      }


      if (zeroDigitCount === 0 && digitLeftCount > 0 && decimalPos >= 0) {
        // Handle "###.###" and "###." and ".###"
        var n = decimalPos;
        if (n === 0) { // Handle ".###"
          ++n;
        }
        digitRightCount = digitLeftCount - n;
        digitLeftCount = n - 1;
        zeroDigitCount = 1;
      }

      // Do syntax checking on the digits.
      if ((decimalPos < 0 && digitRightCount > 0) ||
          (decimalPos >= 0 && (decimalPos < digitLeftCount ||
              decimalPos > (digitLeftCount + zeroDigitCount))) ||
          groupingCount === 0 || inQuote) {
        _throwSyntaxError(pattern);
      }

      if (j === 1) {
        posPrefixPattern = prefix;
        posSuffixPattern = suffix;
        negPrefixPattern = posPrefixPattern;
        negSuffixPattern = posSuffixPattern;
        var digitTotalCount = digitLeftCount + zeroDigitCount +
            digitRightCount;
        // The effectiveDecimalPos is the position the decimal is at or
        //would be at if there is no decimal. Note that if decimalPos<0,
        // then digitTotalCount == digitLeftCount + zeroDigitCount.
        var effectiveDecimalPos = decimalPos >= 0 ?
            decimalPos : digitTotalCount;
        numberSettings['minimumIntegerDigits'] = (effectiveDecimalPos -
            digitLeftCount);
        numberSettings['maximumIntegerDigits'] = (useExponentialNotation ?
            digitLeftCount + numberSettings['minimumIntegerDigits'] :
            _MAXIMUM_INTEGER_DIGITS);
        numberSettings['maximumFractionDigits'] = (decimalPos >= 0 ?
            (digitTotalCount - decimalPos) : 0);
        numberSettings['minimumFractionDigits'] = (decimalPos >= 0 ?
            (digitLeftCount + zeroDigitCount - decimalPos) : 0);
        numberSettings['groupingSize'] = (groupingCount > 0) ?
            groupingCount : 0;
        numberSettings['groupingSize0'] = groupingCount0;
      }
      else {
        negPrefixPattern = prefix;
        negSuffixPattern = suffix;
        gotNegative = true;
      }
    }

    if (pattern.length === 0) {
      posPrefixPattern = posSuffixPattern = "";
      numberSettings['minimumIntegerDigits'] = 0;
      numberSettings['maximumIntegerDigits'] = _MAXIMUM_INTEGER_DIGITS;
      numberSettings['minimumFractionDigits'] = 0;
      numberSettings['maximumFractionDigits'] = _MAXIMUM_FRACTION_DIGITS;
    }
    numberSettings['useExponentialNotation'] = useExponentialNotation;
    numberSettings['minExponentDigits'] = minExponentDigits;
    // If there was no negative pattern, or if the negative pattern is
    // identical to the positive pattern, then prepend the minus sign to
    // the positive pattern to form the negative pattern.
    if (!gotNegative ||
        ((negPrefixPattern.localeCompare(posPrefixPattern) === 0)
            && (negSuffixPattern.localeCompare(posSuffixPattern) === 0))) {
      if (options['style'] === 'currency' && numberSettings['lang'] === 'ar') {
        negSuffixPattern = posSuffixPattern + "'\u200f-";
        negPrefixPattern = posPrefixPattern;
      }
      else {
        negSuffixPattern = posSuffixPattern;
        negPrefixPattern = "'-" + posPrefixPattern;

      }
    }
    _expandAffixes(localeElements, numberSettings);
  };

  _getRoundedNumber = function (ret, numberSettings, options) {
    var precision = numberSettings['maximumFractionDigits'];
    var isNegative = ret < 0;
    var mode = options['roundingMode'] || 'DEFAULT';
    var roundedNumber = _roundNumber(Math.abs(ret), precision, mode);
    return isNegative ? -roundedNumber : roundedNumber;
  };

  _resolveNumberSettings = function (localeElements, options, locale) {
    var numberSettings = {};
    _validateNumberOptions(options, "OraNumberConverter.resolvedOptions");
    _getNumberSettings(localeElements, numberSettings, options, locale);
    numberSettings['numberingSystemKey'] = _getNumberingExtension(locale);
    if (OraI18nUtils.numeringSystems[numberSettings['numberingSystemKey']] ===
        undefined)
      numberSettings['numberingSystemKey'] = 'latn';
    return numberSettings;
  };

  _resolveOptions = function (numberSettings, options, locale) {
    var resOptions = {
      'locale': locale,
      'style': (options['style'] === undefined) ? 'decimal' : options['style'],
      'useGrouping': (options['useGrouping'] === undefined) ? true : options['useGrouping'],
      'numberingSystem': numberSettings['numberingSystemKey']
    };
    resOptions['minimumIntegerDigits'] = numberSettings['minimumIntegerDigits'];
    resOptions['minimumFractionDigits'] = numberSettings['minimumFractionDigits'];
    resOptions['maximumFractionDigits'] = numberSettings['maximumFractionDigits'];
    if (options['style'] === 'decimal' && options['decimalFormat'] !== undefined) {
      resOptions['decimalFormat'] = options['decimalFormat'];
    }
    if (options['style'] === 'currency') {
      resOptions['currency'] = options['currency'];
      resOptions['currencyDisplay'] = (options['currencyDisplay'] ===
          undefined) ? 'symbol' : options['currencyDisplay'];
    }
    if (options['pattern'] !== undefined)
      resOptions['pattern'] = options['pattern'];
    var roundingMode = options['roundingMode'];
    var roundDuringParse = options['roundDuringParse'];
    if (roundingMode !== undefined)
      resOptions['roundingMode'] = roundingMode;
    if (roundDuringParse !== undefined)
      resOptions['roundDuringParse'] = roundDuringParse;
    return resOptions;
  };

  function _init()
  {

    return {
      /**
       * Format a number.
       * @memberOf OraNumberConverter
       * @param {number} value - Number object to be formatted.
       * @param {Object} localeElements - the instance of LocaleElements  
       * bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>style.</b>  is one of the String values "decimal", "currency"  
       * or "percent". The default is "decimal".<br>
       * - <b>decimalFormat.</b> is used in conjuction with "decimal" style. 
       * It can have one of the string values "short", "long". It is used for 
       * compact number formatting. For example 3000 is displayed
       *  as 3K for "short" and 3 thousand for "long". We take into consideration
       *  the locale's plural rules for the compact pattern.<br> 
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       *  when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as  
       * an ISO 4217 alphabetic currency code, 
       * a localized currency symbol, or a localized currency name if 
       * formatting with the "currency" style. It is only present when style 
       * has the value "currency". The default is "symbol".<br>
       * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value 
       * indicating the minimum integer digits to be used. Numbers will be 
       * padded with leading zeroes if necessary.<br>
       * - <b>minimumFractionDigits.</b> a non-negative integer Number value 
       * indicating the minimum fraction digits to be used. Numbers will be 
       * padded with trailing zeroes if necessary.<br>
       * - <b>maximumFractionDigits.</b> a non-negative integer Number value 
       * indicating the maximum fraction digits to be used. Numbers will be 
       * rounded if necessary.<br>
       * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
       *  Java.Math.RoundingMode behavior. Currently we support the options : 
       *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
       * - <b>useGrouping.</b> is a Boolean value indicating whether a 
       * grouping separator should be used. The default is true.<br>
       * - <b>pattern.</b> custom pattern. Will override above options 
       * when present.
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {string} formatted number.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing.
       * @throws {SyntaxError} If an unexpected character is encountered in 
       * the pattern.
       */
      format: function (value, localeElements, options, locale) {
        if (arguments.length <= 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        _validateNumberOptions(options, "OraNumberConverter.format");
        var numberSettings = {};
        _getNumberSettings(localeElements, numberSettings, options, locale);
        return _formatNumberImpl(value, options, localeElements,
            numberSettings, locale);
      },
      /**
       * Parse a number.
       * @memberOf OraNumberConverter
       * @param {string|number} str - string to be parsed.
       * @param {Object} localeElements - the instance of LocaleElements 
       * bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>style.</b>  is one of the String values "decimal", "currency" or 
       * "percent". The default is "decimal".<br>
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       * when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as 
       * an ISO 4217 alphabetic currency code,
       *  a localized currency symbol, or a localized currency name if 
       *  formatting with the "currency" style. It is only considered when 
       *  style has the value "currency". The default is "symbol".<br>
       * - <b>pattern.</b> custom pattern. Will override above options when 
       * present.<br>
       * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
       *  Java.Math.RoundingMode behavior. Currently we support the options : 
       *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
       *  - <b>roundDuringParse.</b> Boolean value. Specifies whether or not to round during parse.
       *  by default the number converter rounds during format but not during parse.
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {number} a number object parsed from the string. In case of 
       * error, returns null.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing.
       * @throws {SyntaxError} If an unexpected character is encountered in 
       * the pattern.
       * @throws {Error} If the <i>str</i> parameter does not match the number 
       * pattern.
       */
      parse: function (str, localeElements, options, locale) {
        if (typeof str === "number")
          return str;
        if (Object.prototype.toString.call(str) === '[object Number]')
          return  Number(str);
        if (arguments.length <= 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        _validateNumberOptions(options, "OraNumberConverter.parse");
        return _parseNumberImpl(str, localeElements, options, locale);
      },
      /**
       * Resolve options.
       * Returns a new object with properties reflecting the number formatting 
       * options computed based on the options parameter.
       * If options is not provided, the properties will be derived from the 
       * locale defaults.
       * @memberOf OraNumberConverter
       * @param {Object} localeElements - the instance of LocaleElements 
       * bundle
       * @param {Object=} options containing the following properties:<br>
       * - <b>style.</b> "decimal", "currency" or "percent". The default is 
       * "decimal".<br>
       * - <b>decimalFormat.</b> It can have one of the string values "short", "long".
       *  It is used for compact number formatting. For example 3000 is displayed
       *  as 3K for "short" and 3 thousand for "long". We take into consideration
       *  the locale's plural rules for the compact pattern.<br> 
       * - <b>currency.</b> An ISO 4217 alphabetic currency code. Mandatory 
       * when when style is "currency".<br>
       * - <b>currencyDisplay.</b> is one of the String values "code", 
       * "symbol", or "name", specifying whether to display the currency as 
       * an ISO 4217 alphabetic currency code,
       *   a localized currency symbol, or a localized currency name if 
       *   formatting with the "currency" style. It is only present 
       *   when style has the value "currency". The default is "symbol".<br>
       * - <b>minimumIntegerDigits.</b> is a non-negative integer Number value 
       * indicating the minimum integer digits to be used. Numbers will be 
       * padded with leading zeroes if necessary.<br>
       * - <b>minimumFractionDigits.</b> a non-negative integer Number value 
       * indicating the minimum fraction digits to be used. Numbers will be 
       * padded with trailing zeroes if necessary.<br>
       * - <b>maximumFractionDigits.</b> a non-negative integer Number value 
       * indicating the maximum fraction digits to be used. Numbers will be 
       * rounded if necessary.<br>
       * - <b>numberingSystem</b>. The numbering system.<br>
       * - <b>useGrouping.</b> is a Boolean value indicating whether a 
       * grouping separator should be used. The default is true.<br>
       * - <b>pattern.</b> custom pattern. Will override above options when 
       * present.<br>
       * - <b>roundingMode.</b> specifies the rounding behavior. This follows the
       *  Java.Math.RoundingMode behavior. Currently we support the options : 
       *  HALF_UP, HALF_DOWN, and HALF_EVEN<br>
       *  - <b>roundDuringParse.</b> Boolean value. Specifies whether or not to round during parse.
       *  by default the number converter rounds during format but not during parse.
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys. 
       * @return {Object} Resolved options object.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {TypeError} If the style is currency and currency code is 
       * missing. 
       */
      resolvedOptions: function (localeElements, options, locale) {
        if (arguments.length < 3 || locale === undefined) {
          locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        }
        if (arguments.length < 2 || options === undefined) {
          options = {
            'useGrouping': true,
            'style': 'decimal'
          };
        }
        var numberSettings = _resolveNumberSettings(localeElements, options, locale);
        return _resolveOptions(numberSettings, options, locale);
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraNumberConverter class.  
     * @memberOf OraNumberConverter
     * @return {Object} The singleton OraNumberConverter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());
/**
 * Copyright (c) 2008, 2013, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a RegExpValidator that ensures the value matches the provided pattern
 * @param {Object} options an object literal used to provide the pattern, an optional hint and error 
 * message.
 * @param {RegExp=} options.pattern - a regexp pattern that the validator matches a value against.<p>
 * Example:<br/>
 * '\\d{10}'
 * @param {string=} options.hint - an optional hint text. There is no default hint provided by the 
 * validator. It is generally not recommended to show the actual pattern in the hint as it might be 
 * confusing to end-user, but if you do, you can use the {pattern} token.<p>
 * <p>The hint string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: <br/>
 * {pattern} - the pattern to enforce<p>
 * Example:<br/>
 * "value must meet this pattern {pattern}" 
 * @param {string=} options.messageSummary - a custom error message summarizing the error when the 
 * users input does not match the specified pattern. When not present, the default summary is the 
 * resource defined with the key <code class="prettyprint">oj-validator.regExp.summary</code>. 
 * It is generally not recommended to show the actual pattern in the message as it might be 
 *  confusing to end-user. <p>
 * <p>The messageSummary string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens: <p>
 * {label} - label of the component for which this message applies. The label may not always be 
 * available depending on the usage of the validator. <br/>
 * {pattern} - the pattern the value should match<br/>
 * {value} - value entered by user<p>
 * Examples:<br/>
 * "'{label}' Format Incorrect" // translating to 'Phone Number' Format Incorrect
 * @param {string=} options.messageDetail - a custom error message to be used for creating detail 
 * part of message, when the users input does not match the specified pattern. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.regExp.detail</code>.<p>
 * <p>The messageDetail string is passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p>
 * Tokens:<br/>
 * {label} - label text of the component for which this message applies. <br/>
 * {pattern} the 'pattern' that the value should match <br/>
 * {value} value entered by the user <p>
 * Examples:<br/>
 * "The value {value} must contain at least 3 alphanumeric characters"<br/>
 * @export
 * @constructor
 * @since 0.6
 */
oj.RegExpValidator = function (options)
{
  this.Init(options);
};

// Subclass from oj.Object or oj.Validator. It does not matter
oj.Object.createSubclass(oj.RegExpValidator, oj.Validator, "oj.RegExpValidator");

// key to access required validator specific resources in the bundle 
oj.RegExpValidator._BUNDLE_KEY_DETAIL = "oj-validator.regExp.detail";
oj.RegExpValidator._BUNDLE_KEY_SUMMARY = "oj-validator.regExp.summary";

/**
 * Initializes validator instance with the set options
 * @param {Object} options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.Init = function (options)
{
  oj.RegExpValidator.superclass.Init.call(this);
  this._options = options;
};

/**
 * Validates value for matches using the regular expression provided by the pattern. This method 
 * does not raise an error when value is the empty string or null; the method returns true indicating
 * that the validation was successful. If the application wants the empty string to fail validation, 
 * then the application should chain in the required validator (e.g., set required on the input). 
 *  
 * @param {string|number} value that is being validated 
 * @returns {boolean} true if validation was successful 
 * 
 * @throws {Error} when there is no match
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.validate = function (value)
{
  var detail;
  var label;
  var params;
  var pattern = (this._options && this._options['pattern']) || "";

  var summary;


  // don't validate null or empty string; per 
  // There are one of two ways we could handle the empty string:
  // 1) blow up on null and then require that customers wrap the validator with one that 
  // succeeds on null if they don’t like the behavior 
  // 2) Accept null and expect that the application will chain in the required checked if necessary
  // As a team we decided 2) was better than 1).
  if (value === null || value === undefined || value === "")
  {
    return true;
  }

  // when using digits as input values parseString becomes a integer type, so get away with it.
  value = (value || value === 0) ? value.toString() : value;

  // We intend that the pattern provided is matched exactly
  var exactPattern = "^(" + pattern + ")$", valid = false,
  localizedDetail, localizedSummary, matchArr;

  matchArr = value.match(exactPattern);
  if ((matchArr !== null) && (matchArr[0] === value))
  {
    valid = true;
  }
  else
  {
    if (this._options)
    {
      summary = this._options['messageSummary'] || null;
      detail = this._options['messageDetail'] || null;
      label = this._options && this._options['label'] || "";
    }

    params = {'label': label, 'pattern': pattern, 'value': value};
    localizedSummary = summary ?
    oj.Translations.applyParameters(summary, params) :
    oj.Translations.getTranslatedString(this._getSummaryKey(), params);
    localizedDetail = (detail) ?
    oj.Translations.applyParameters(detail, params) :
    oj.Translations.getTranslatedString(this._getDetailKey(), params);

    throw new oj.ValidatorError(localizedSummary, localizedDetail);
  }

  return valid;
};

/**
 * A message to be used as hint, when giving a hint on the expected pattern. There is no default 
 * hint for this property.
 * 
 * @returns {String|null} a hint message or null if no hint is available in the options
 * @memberof oj.RegExpValidator
 * @instance
 * @export
 */
oj.RegExpValidator.prototype.getHint = function ()
{
  var hint = null;
  var params = {};
  if (this._options && (this._options['hint']))
  {
    params = {'pattern': this._options['pattern']};
    hint = oj.Translations.applyParameters(this._options['hint'], params);
  }

  return hint;
};

oj.RegExpValidator.prototype._getSummaryKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_SUMMARY;
};

oj.RegExpValidator.prototype._getDetailKey = function ()
{
  return oj.RegExpValidator._BUNDLE_KEY_DETAIL;
};
/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * @export
 * @class oj.IntlConverterUtils
 * @classdesc Utility function for converters 
 * @since 0.7
 */
oj.IntlConverterUtils = {};

/**
 * Parses the isoString and returns a JavaScript Date object
 * 
 * @expose
 * @param {string} isoString isoString to parse and to return Date of
 * @return {Date} the parsed JavaScript Date Object
 */
oj.IntlConverterUtils.isoToDate = function(isoString) 
{
  return OraI18nUtils.isoToDate(isoString);
}

/**
 * Returns a local Date object provided a local isoString
 * 
 * @param {string} isoString date in isoString format
 * @returns {Date} localDate 
 * @expose
 * @since 0.7
 */
oj.IntlConverterUtils.isoToLocalDate = function(isoString) 
{
  return OraI18nUtils.isoToLocalDate(isoString);
}

/**
 * Returns a local isoString provided a Date object
 * 
 * @param {Date} date
 * @returns {string} isoString 
 * @expose
 * @since 0.7
 */
oj.IntlConverterUtils.dateToLocalIso = function(date) 
{
  return OraI18nUtils.dateToLocalIso(date);
}

oj.IntlConverterUtils._getTimeZone = function(isoString) 
{
  return OraI18nUtils._getTimeZone(isoString);
}

/**
 * Returns the timezone offset between UTC and the local time in Etc/GMT[+-]hh:mm syntax.
 * The offset is positive if the local timezone is behind UTC and negative if
 * it is ahead. The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14)
 * 
 * @example <caption>The local time is UTC-7 (Pacific Daylight Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT+07:00" 
 *
 * @example <caption>The local time is UTC+1 (Central European Standard Time)</caption>
 * oj.IntlConverterUtils.getLocalTimeZoneOffset() will return the string "Etc/GMT-01:00" 
 * 
 * @expose 
 * @returns {string}
 */
oj.IntlConverterUtils.getLocalTimeZoneOffset = function() 
{
  return OraI18nUtils.getLocalTimeZoneOffset();
}

/**
 * Given either an Object literal representing a 'converter' option (used in components) or a 
 * converter instance of type oj.Converter, this method returns the converter instance.
 * 
 * @param {Object} converterOption
 * @returns {Object} converterInstance or null if a converter cannot be determined
 * @expose
 * @since 0.6
 */
oj.IntlConverterUtils.getConverterInstance = function (converterOption)
{
  var cTypeStr = "", cOptions = {}, converterInstance = null, cf;
  
  if (converterOption)
  {
    if (typeof converterOption === "object")
    {
      // TODO: Should we check that it duck types oj.Converter?
      if (converterOption instanceof oj.Converter || 
          (converterOption['parse'] && typeof converterOption['parse'] === "function") || 
          (converterOption['format'] && typeof converterOption['format'] === "function"))
      {
        // we are dealing with a converter instance
        converterInstance = converterOption;
      }
      else 
      {
        // check if there is a type set
        cTypeStr = converterOption['type'];
        cOptions = converterOption['options'] || {};
      }
    }

    if (!converterInstance)
    {
      // either we have an object literal or just plain string.
      cTypeStr = cTypeStr || converterOption;
      if (cTypeStr && typeof cTypeStr === "string")
      {
        // if we are passed a string get registered type. 
        cf = oj.Validation.converterFactory(cTypeStr);
        converterInstance = cf.createConverter(cOptions);
      }
    }
  }
  
  return converterInstance;
};

/**
 * So the requirement is if min or max lacks date portion and value contains it, then min + max should use 
 * value's date portion
 * 
 * @param {string} minMax date in isoString format
 * @param {string} value date in isoString format
 * @returns {string} merged date in isoString format
 * @expose
 * @ignore
 * @since 1.2
 */
oj.IntlConverterUtils._minMaxIsoString = function(minMax, value) 
{
  if(minMax) 
  {
    value = value || this.dateToLocalIso(new Date());
    
    var vTindex = value.indexOf("T");

    if(minMax.indexOf("T") === 0 && vTindex > 0) 
    {
      //meaning only time exists for minMax and value contains date
      minMax = value.substring(0, vTindex) + minMax;
    }
  }
  
  return minMax;
};

// PACKAGE PRIVATE

/**
 * Processes an converter option error and returns a oj.ConverterERror instance.
 * @param {string} errorCode
 * @param {Object} parameterMap
 * @return {Object} an oj.ConverterError instance
 * @private
 */
oj.IntlConverterUtils.__getConverterOptionError = function(errorCode, parameterMap)
{
  oj.Assert.assertObject(parameterMap);
  var summary = "", detail = "", propName = parameterMap['propertyName'], reqPropName, 
          propValueValid;
  
  if (errorCode === "optionTypesMismatch")
  {
    reqPropName = parameterMap['requiredPropertyName'];
    propValueValid = parameterMap['requiredPropertyValueValid'];
    // Summary: A value for the property '{requiredPropertyName}' is required when the property 
    // '{propertyName}' is set to '{propertyValue}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypesMismatch.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue'],
       'requiredPropertyName': reqPropName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(reqPropName, propValueValid);
  }
  else if (errorCode === "optionTypeInvalid")
  {
    // Summary: A value of the expected type was not provided for '{propertyName}'.
    propName = parameterMap['propertyName'];
    propValueValid = parameterMap['propertyValueValid'];
    summary = oj.Translations.getTranslatedString("oj-converter.optionTypeInvalid.summary", 
      {'propertyName': propName});

    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionOutOfRange")
  {
    // The value {propertyValue} is out of range for the option '{propertyName}'.
    summary = oj.Translations.getTranslatedString("oj-converter.optionOutOfRange.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});

    propValueValid = parameterMap['propertyValueValid'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  else if (errorCode === "optionValueInvalid")
  {
    // An invalid value '{propertyValue}' was specified for the option '{propertyName}'.. 
    summary = oj.Translations.getTranslatedString("oj-converter.optionValueInvalid.summary", 
      {'propertyName': propName,
       'propertyValue': parameterMap['propertyValue']});
    
    propValueValid = parameterMap['propertyValueHint'];
    detail = oj.IntlConverterUtils._getOptionValueDetailMessage(propName, propValueValid);
  }
  
  return new oj.ConverterError(summary, detail);

};

/**
 * Builds the detail message for possible converter option values. Only applicable when errorInfo is 
 * returned from JET converter implementation.
 * 
 * @param {string} propName name of the property 
 * @param {Array|string} propValueValid valid value or values expected.
 * 
 * @return {string} the localized message
 * @private
 */
oj.IntlConverterUtils._getOptionValueDetailMessage = function (propName, propValueValid)
{
  // Detail: An accepted value for '{propertyName}' is '{propertyValueValid}'. or 
  // Accepted values for '{propertyName}' are '{propertyValueValid}'.
  var resourceKey;
  
  if (propValueValid)
  {
    if (typeof propValueValid === "string")
    {
      resourceKey = "oj-converter.optionHint.detail";
    }
    else
    {
      // we have an array of values
      resourceKey = "oj-converter.optionHint.detail-plural";
      propValueValid = 
         propValueValid.join(oj.Translations.getTranslatedString("oj-converter.plural-separator"));
    }
    return oj.Translations.getTranslatedString(resourceKey, 
      {'propertyName': propName,
       'propertyValueValid': propValueValid});

  }
  
  return "";
};

/**
 * Returns the default value for non-truthy values.
 * 
 * @returns {string} an empty string
 * @private
 */
oj.IntlConverterUtils.__getNullFormattedValue = function ()
{
  return "";
};

/**
 * Will return an updated toIsoString using the timePortion from the fromIsoString or from the default 
 * OraI18nUtils.DEFAULT_TIME_PORTION
 * 
 * @private
 * @expose
 * @param {string} fromIsoString isoString that may not be a complete isoString
 * @param {string} toIsoString isoString that may not be a complete isoString
 * @returns {string} modified toIsoString with original date portion and the time portion from the fromIsoString
 * @since 1.1
 */
oj.IntlConverterUtils._copyTimeOver = function(fromIsoString, toIsoString) 
{
  return OraI18nUtils._copyTimeOver(fromIsoString, toIsoString);
}

/**
 * Clears the time portion of the isoString
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} an updated isoString
 * @since 1.1
 */
oj.IntlConverterUtils._clearTime = function(isoString) 
{
  return OraI18nUtils._clearTime(isoString);
}

/**
 * Will accept an isoString and perform a get operation or a set operation depending on whether param is an Array 
 * or a JSON 
 * 
 * The keys for the get and set operation are defined in OraI18nUtils's _DATE_TIME_KEYS.
 * 
 * Note the handling of month starting with 0 in Date object and being 1 based in isoString will be handled by the function 
 * with the usage of doParseValue. Meaning when you doParseValue and you are getting the value it will automatically 
 * decrement the value and when you are setting the param it will check if the value is of number and if so will 
 * increment it.
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @param {Array|Object} actionParam if an Array will be a get operation, if a JSON will be a set operation
 * @param {boolean=} doParseValue whether one should parseInt the value during the get request
 * @returns {Object|string} an Object when a get operation and a string when a set operation
 * @since 1.1
 */
oj.IntlConverterUtils._dateTime = function(isoString, actionParam, doParseValue) 
{
  return OraI18nUtils._dateTime(isoString, actionParam, doParseValue);
}

/**
 * So the problem is Jet uses incomplete isoString which causes issues in different browsers. 
 * 
 * For instance for a new Date().toISOString() => 2015-02-02T18:00:37.007Z
 * ojInputDate stores 2015-02-02
 * ojInputTime stores T18:00:37.007Z
 * 
 * yet constructing new Date(val) on above causes different results or errors in different browsers, so 
 * this function is to normalize them. Note it is assumed that the point is creating the Date object from the 
 * normalized isoString. Meaning if both contain only the time portion today's date will appended to it.
 * 
 * @private
 * @expose
 * @param {string} isoString isoString that may not be a complete isoString
 * @returns {string} a normalized isoString
 * @since 1.1
 */
oj.IntlConverterUtils._normalizeIsoString = function(isoString) 
{
  return OraI18nUtils._normalizeIsoString(isoString);
}
/**
 * This is a forked version of globalize.js
 */
/*
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 */
/**
 * @constructor
 * 
 * @classdesc OraDateTimeConverter object implements date-time parsing and formatting and 
 * relative date formatting. 
 * <p>
 * There are several ways to use the converter.
 * <ul>
 * <li>Using options defined by the ECMA 402 Specification, these would be the properties year, 
 * month, day, hour, minute, second, weekday, era, timeZone, hour12</li>
 * <li>Using a custom date and/or time format pattern using the 'pattern' property</li>
 * <li>Using the standard date, datetime and time format lengths defined by Unicode CLDR, these 
 * would include the properties formaType, dateFormat, timeFormat.</li>
 * </ul>
 * 
 * <p>
 * The options when specified take precendence in the following order:<br>
 * 1. pattern.<br>
 * 2. ECMA options.<br>
 * 3. formatType/dateFormat/timeFormat.
 * <p>
 * The converter provides great leniency when parsing a user input value to a date in the following 
 * ways: <br/>
 * <ul>
 * <li>Allows use of any character for separators irrespective of the separator specified in the 
 * associated pattern. E.g., if pattern is set to 'y-M-d', the following values are all valid - 
 * 2013-11-16, 2013/11-16 and 2013aaa11xxx16.</li>
 * <li>Allows specifying 4 digit year in any position in relation to day and month. E.g., 11-2013-16 
 * or 16-11-2013</li>
 * <li>Supports auto-correction of value, when month and day positions are swapped as long as the 
 * date is > 12 when working with the Gregorian calendar. E.g., if the pattern is 'y-M-d', 
 * 2013-16-11 will be auto-corrected to 2013-11-16. However if both date and month are less or equal 
 * to 12, no assumptions are made about the day or month and the value parsed against the exact pattern.</li>
 * <li>Supports auto-correction of value, for the short and long types of weekday and month names. 
 * So they can are used anywhere in the value. E.g., if the expected pattern is E, MMM, d, y, all 
 * these values are acceptable - Tue, Nov 26 2013 or Nov, Tue 2013 26 or 2013 Tue 26 Nov. <br/>
 * NOTE: Lenient parsing of narrow era, weekday or month name is not supported because of ambiguity in 
 * choosing the right value. So we expect for narrow era, weekday or month option that values be 
 * provided either in their short or long forms. E.g., Sat, March 02, 2013.
 * </li>
 * <li>Specifying the weekday is optional. E.g., if the expected pattern is E, MMM, d, y; then 
 * entering Nov 26, 2013, is automatically turned to Tuesday Nov 26, 2013. But entering an invalid 
 * weekday, i.e., if the weekday does not match the date, an exception is thrown.</li>
 * <li>Leniency rules apply equally no matter which option is used - pattern, ECMA options or formatType</li>
 * </ul>
 * 
 * @property {Object=} options - an object literal used to provide  optional information to 
 * the converter.<p>
 * @property {string=} options.year - allowed values are "2-digit", "numeric". When no options are 
 * set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the year, padded: 00-99.</td>
 *       <td>2001 => 01, 2016 => 16</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the year depending on the value.</td>
 *       <td>2010, 199</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {number=} options.two-digit-year-start - the 100-year period 2-digit year. 
 * During parsing, two digit years will be placed in the range two-digit-year-start to two-digit-year-start + 100 years. 
 * The default is 1950.
 * <p style='padding-left: 5px;'>
 * Example: if two-digit-year-start is 1950, 10 is parsed as 2010<br/><br/>
 * Example: if two-digit-year-start is 1900, 10 is parsed as 1910
 * </p>
 *
 * @property {string=} options.month - specifies how the month is formatted. Allowed values are 
 * "2-digit", "numeric", "narrow", "short", "long". The last 3 values behave in the same way as for 
 * weekday, indicating the length of the string used. When no options are set the default value of 
 * "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the month, padded: 01-12.</td>
 *       <td>1 => 01, 12 => 12</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the month depending on the value.</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the month.</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the month.</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the month.</td>
 *       <td>January</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.day - specifies how the day is formatted. Allowed values are "2-digit",
 *  "numeric". When no options are set the default value of "numeric" is used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the day in month, padded: 01-31.</td>
 *       <td>1 => 01, 27 => 27</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 31</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.hour - specifies how the hour is formatted. Allowed values are 
 * "2-digit" or "numeric". The hour is displayed using the 12 or 24 hour clock, depending on the 
 * locale. See 'hour12' for details.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>2-digit</td>
 *       <td>2 digit representation of the hour, padded: 01-24 depending on the locale.</td>
 *       <td>1 => 01, 24 => 24</td>
 *     </tr>
 *     <tr>
 *       <td>numeric</td>
 *       <td>variable digit representation of the day in month depending on the value.</td>
 *       <td>1, 24</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.minute - specifies how the minute is formatted. Allowed values are 
 * "2-digit", "numeric". Although allowed values for minute are numeric and 2-digit, minute is always 
 * displayed as 2 digits: 00-59.
 *
 * @property {string=} options.second - specifies whether the second should be displayed as "2-digit" 
 * or "numeric". Although allowed values for second are numeric and 2-digit, second is always displayed 
 * as 2 digits: 00-59.
 *
 * @property {string=} options.millisecond - specifies whether the millisecond should be displayed.
 * Allowed value is "numeric".
 *
 * @property {string=} options.weekday - specifies how the day of the week is formatted. If absent, it 
 * is not included in the date formatting. Allowed values are "narrow", "short", "long" indicating the 
 * length of the string used.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>narrow</td>
 *       <td>narrow name of the day of week.</td>
 *       <td>M</td>
 *     </tr>
 *     <tr>
 *       <td>short</td>
 *       <td>abbreviated name of the day of week.</td>
 *       <td>Mon</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>wide name of the day of week.</td>
 *       <td>Monday</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.era - specifies how the era is included in the formatted date. If 
 * absent, it is not included in the date formatting. Allowed values are "narrow", "short", "long".
 * Although allowed values are narrow, short, long, we only display era in abbreviated format: BC, AD.
 *
 * @property {string=} options.timeZoneName - allowed values are "short", "long".
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>short name of the time zone.</td>
 *       <td>short: short name of the time zone: PDT, PST, EST, EDT. Note: Not all locales have 
 *           translations for short time zone names, in this case we display the English short name</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>short name of the time zone.</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.timeZone - The possible values of the timeZone property are valid IANA 
 * timezone IDs. If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>IANA ID</td>
 *       <td>America/Los_Angeles, Europe/Paris</td>
 *     </tr>
 *     <tr>
 *       <td>Offset</td>
 *       <td>Etc/GMT-8. The offset is positive if the local time zone is behind UTC and negative if it is ahead. 
 *           The offset range is between Etc/GMT-14 and Etc/GMT+12 (UTC-12 and UTC+14). Which means that Etc/GMT-8 
 *           is equivalent to UTC+08.</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.isoStrFormat - specifies in which format the ISO string is returned. 
 * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". 
 * The default format is auto.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>offset</td>
 *       <td>time zone offset from UTC.</td>
 *       <td>2016-01-05T11:30:00-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>zulu</td>
 *       <td>zulu time or UTC time.</td>
 *       <td>2016-01-05T19:30:00Z</td>
 *     </tr>
 *     <tr>
 *       <td>local</td>
 *       <td>local time, does not contain time zone offset.</td>
 *       <td>2016-01-05T19:30:00</td>
 *     </tr>
 *     <tr>
 *       <td>auto</td>
 *       <td>auto means the returned ISO string depends on the input string and options</td>
 *       <td></td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dst - The dst option can be used for time only values in conjunction with offset. 
 * Setting dst to true indicates the time is in DST. By default the time is interpreted as standard time. 
 * The possible values of dst are: "true" or "false". Default is "false".
 * <p style='padding-left: 5px;'>
 * Due to Daylight Saving Time, there is a possibility that a time exists twice If the time falls in the duplicate window 
 * (switching from daylight saving time to standard time). The application can disambiguate the time in the overlapping 
 * period using the dst option. Setting dst to true indicates the time is in DST. By default the time is interpreted as 
 * standard time.<br/><br/>
 * Example: On November 1st, 2105 in US the time between 1 and 2 AM will be repeated. The dst option can indicate the 
 * distinction as follows. Initially the time is in DST, so dst:'true' is specified.<br/>
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset', dst : true};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-07:00
 * <br/><br/>
 * If the user does not pass the dst option, the time will be interpreted as standard time. 
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:59:59 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:59:59-08:00
 * <br/><br/>
 * At 2AM, DST will be over and the clock brings back to 1AM. Then the dst option should be false or not specified.
 * var options = {formatType:'datetime', dateFormat:'short', timeFormat:'medium', timeZone:'America/Los_Angeles', isoStrFormat: 'offset'};<br/>
 * var localeElements = oj.getLocaleElemnts();<br/>
 * var str= "11/1/15 1:00:00 AM";<br/>
 * cnv.parse(str, localeElements, options);-->2015-11-01T01:00:00-08:00
 * </p>
 *
 * @property {boolean=} options.hour12 - specifies what time notation is used for formatting the time. 
 * A true value uses the 12-hour clock and false uses the 24-hour clock (often called military time 
 * in the US). This property is undefined if the hour property is not used when formatting the date.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>true</td>
 *       <td>T13:10  is formatted as 1:10 PM</td>
 *     </tr>
 *     <tr>
 *       <td>false</td>
 *       <td>T13:10 is formatted as 13:10</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 * 
 * @property {string=} options.pattern - a localized string pattern, where the the characters used in 
 * pattern conform to Unicode CLDR for date time formats. This will override all other options 
 * when present. <br/>
 * NOTE: 'pattern' is provided for backwards compatibility with existing apps that may want the 
 * convenience of specifying an explicit format mask. Setting a 'pattern' will override the default 
 * locale specific format.
 * NOTE: The supported tokens for timezone are of 'Z', 'VV', and 'X'.<br/><br/>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Letter</th>
 *       <th>Date or Time Component</th>
 *       <th>Examples</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>G, GG, GGG</td>
 *       <td>Era designator</td>
 *       <td>AD</td>
 *     </tr>
 *     <tr>
 *       <td>y</td>
 *       <td>numeric representation of year</td>
 *       <td>1, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>yy</td>
 *       <td>2-digit representation of year</td>
 *       <td>01, 14</td>
 *     </tr>
 *     <tr>
 *       <td>yyyy</td>
 *       <td>4-digit representation of year</td>
 *       <td>0001, 2014</td>
 *     </tr>
 *     <tr>
 *       <td>M</td>
 *       <td>Numeric representation of month in year: (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MM</td>
 *       <td>2-digit representation of month in year: (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>MMM</td>
 *       <td>Formatted  name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>MMMM</td>
 *       <td>Formatted  name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>MMMMM</td>
 *       <td>Formatted  name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>LLL</td>
 *       <td>Stand-alone name of the month, abbreviated</td>
 *       <td>Jan</td>
 *     </tr>
 *     <tr>
 *       <td>LLLL</td>
 *       <td>Stand-alone name of the month, wide</td>
 *       <td>January</td>
 *     </tr>
 *     <tr>
 *       <td>LLLLL</td>
 *       <td>Stand-alone name of the month, narrow</td>
 *       <td>J</td>
 *     </tr>
 *     <tr>
 *       <td>d</td>
 *       <td>Numeric representation of  day in month (1-31)</td>
 *       <td>1, 21</td>
 *     </tr>
 *     <tr>
 *       <td>dd</td>
 *       <td>2-digit representation of  day in month (01-31)</td>
 *       <td>01, 21</td>
 *     </tr>
 *     <tr>
 *       <td>E, EE, EEE</td>
 *       <td>Formatted name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>EEEE</td>
 *       <td>Formatted name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>EEEEE</td>
 *       <td>Formatted name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>c, cc, ccc</td>
 *       <td>Stand-alone name of day in week, abbreviated</td>
 *       <td>Tue</td>
 *     </tr>
 *     <tr>
 *       <td>cccc</td>
 *       <td>Stand-alone name of day in week, wide</td>
 *       <td>Tuesday</td>
 *     </tr>
 *     <tr>
 *       <td>ccccc</td>
 *       <td>Stand-alone name of day in week, narrow</td>
 *       <td>T</td>
 *     </tr>
 *     <tr>
 *       <td>a</td>
 *       <td>am/pm marker</td>
 *       <td>PM</td>
 *     </tr>
 *     <tr>
 *       <td>H</td>
 *       <td>Numeric hour in day (0-23)</td>
 *       <td>1, 23</td>
 *     </tr>
 *     <tr>
 *       <td>HH</td>
 *       <td>2-digit hour in day (00-23)</td>
 *       <td>01, 23</td>
 *     </tr>
 *     <tr>
 *       <td>h</td>
 *       <td>Numeric  hour in am/pm (1-12)</td>
 *       <td>1, 12</td>
 *     </tr>
 *     <tr>
 *       <td>hh</td>
 *       <td>2-digit hour in day (01-12)</td>
 *       <td>01, 12</td>
 *     </tr>
 *     <tr>
 *       <td>k</td>
 *       <td>Numeric  hour in day (1-24)</td>
 *       <td>1, 24</td>
 *     </tr>
 *     <tr>
 *       <td>kk</td>
 *       <td>2-digit hour in day (1-24)</td>
 *       <td>01, 24</td>
 *     </tr>
 *     <tr>
 *       <td>K</td>
 *       <td>Numeric  hour in am/pm (0-11)</td>
 *       <td>1, 11</td>
 *     </tr>
 *     <tr>
 *       <td>KK</td>
 *       <td>2-digit hour in am/pm (0-11)</td>
 *       <td>01, 11</td>
 *     </tr>
 *     <tr>
 *       <td>m, mm</td>
 *       <td>2-digit  minute in hour (00-59)</td>
 *       <td>05, 59</td>
 *     </tr>
 *     <tr>
 *       <td>s, ss</td>
 *       <td>2-digit second in minute (00-59)</td>
 *       <td>01, 59</td>
 *     </tr>
 *     <tr>
 *       <td>S</td>
 *       <td>Numeric  Millisecond (0-999)</td>
 *       <td>1, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SS</td>
 *       <td>2-digit Millisecond (00-999)</td>
 *       <td>01, 999</td>
 *     </tr>
 *     <tr>
 *       <td>SSS</td>
 *       <td>3-digit Millisecond (000-999)</td>
 *       <td>001, 999</td>
 *     </tr>
 *     <tr>
 *       <td>z, zz, zzz</td>
 *       <td>Abbreviated time zone name</td>
 *       <td>PDT, PST</td>
 *     </tr>
 *     <tr>
 *       <td>zzzz</td>
 *       <td>Full time zone name</td>
 *       <td>Pacific Standard Time, Pacific Daylight Time</td>
 *     </tr>
 *     <tr>
 *       <td>Z, ZZ, ZZZ</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>X</td>
 *       <td>Sign hours</td>
 *       <td>-08</td>
 *     </tr>
 *     <tr>
 *       <td>XX</td>
 *       <td>Sign hours minutes</td>
 *       <td>-0800</td>
 *     </tr>
 *     <tr>
 *       <td>XXX</td>
 *       <td>Sign hours:minutes</td>
 *       <td>-08:00</td>
 *     </tr>
 *     <tr>
 *       <td>VV</td>
 *       <td>Time zone ID</td>
 *       <td>Americs/Los_Angeles</td>
 *     </tr>
 *   </tbody>
 * </table>
 * 
 * @property {string=} options.formatType - determines the 'standard' date and/or time format lengths 
 * to use. Allowed values: "date", "time", "datetime". See 'dateFormat' and 'timeFormat' options. 
 * When set a value must be specified.
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Description</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>datetime</td>
 *       <td>date and time portions are displayed.</td>
 *       <td>September 20, 2015 12:04 PM September 20, 2015 12:05:35 PM Pacific Daylight Time</td>
 *     </tr>
 *     <tr>
 *       <td>date</td>
 *       <td>date portion only is displayed.</td>
 *       <td>September 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>time</td>
 *       <td>time portion only is displayed.</td>
 *       <td>12:05:35</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.dateFormat - specifies the standard date format length to use when 
 * formatType is set to "date" or "datetime". Allowed values are : "short" (default), "medium", "long", 
 * "full". 
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>9/20/15</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>Sep 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>September 20, 2015</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>Sunday, September 20, 2015</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 *
 * @property {string=} options.timeFormat - specifies the standard time format length to use when 
 * 'formatType' is set to "time" or "datetime". Allowed values: "short" (default), "medium", "long", 
 * "full". 
 * <p style='padding-left: 5px;'>
 * <table class="generic-table styling-table">
 *   <thead>
 *     <tr>
 *       <th>Option</th>
 *       <th>Example</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>short</td>
 *       <td>12:11 PM</td>
 *     </tr>
 *     <tr>
 *       <td>medium</td>
 *       <td>12:11:23 PM</td>
 *     </tr>
 *     <tr>
 *       <td>long</td>
 *       <td>12:12:19 PM PDT</td>
 *     </tr>
 *     <tr>
 *       <td>full</td>
 *       <td>12:12:37 PM Pacific Daylight Time</td>
 *     </tr>
 *   </tbody>
 * </table>
 * </p>
 * 
 * @example <caption>Create a date time converter using no options. This uses the default value for 
 * year, month, day properties</caption>
 * var converter = OraDateTimeConverter.getInstance();
 * var localeElements;
 * var resolved = converter.resolvedOptions(localeElements);
 * // logs "day=numeric, month=numeric, year=numeric"
 * console.log("day=" + resolved.day + ", month=" + resolved.month + ", year=" + resolved.year);
 * <br/>
 * 
 * @example <caption>Use a converter using the ECMA options to represent date</caption>
 * var options = { year:'2-digit', month: '2-digit', day: '2-digit'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 * 
 * 
 * @example <caption>Converter using the 'pattern' option</caption>
 * var options = {pattern: 'MM-dd-yyyy'}; 
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 * 
 * @example <caption>Converter using predefined style</caption>
 * var options = {formatType: 'date', dateFormat: 'medium'}; 
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with IANA timezone ID with 
 * isoStrFormat of offset.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'America/Los_Angeles', isoStrFormat: 'offset'};
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var date = "2016-04-17T13:05:30";
 * var str = converter.format(date, localeElements, options);<br/>
 *
 * @example <caption>Create a date time converter using specific pattern with Etc/GMT timezone ID with 
 * isoStrFormat of zulu.</caption>
 * var options = {pattern: 'MM/dd/yy hh:mm:ss a Z', timeZone: 'Etc/GMT-08:00', isoStrFormat: 'zulu'};  
 * var localeElements;
 * var converter = OraDateTimeConverter.getInstance();
 * var str = "01/05/16 01:01:01 AM +0800";
 * var obj = converter.parse(str, localeElements, options);<br/>
 * 
 * @name OraDateTimeConverter
 */

/**
 * @ignore
 */
var OraDateTimeConverter;

OraDateTimeConverter = (function () {
  var instance;
  var _appendPreOrPostMatch;
  var _expandFormat;
  var _expandISOFormat;
  var _parseExact;
  var _formatImpl;
  var _parseImpl;
  var _formatRelativeImpl;
  var _throwInvalidDateFormat;
  var _getResolvedOptionsFromPattern;
  var _dateTimeStyle;
  var _isoStrDateTimeStyle;
  var _get2DigitYearStart;
  var _isHour12;
  var _dateTimeStyleFromPattern;
  var _expandPredefinedStylesFormat;
  var _localeDataCache = {};
  var _timeZoneDataCache = {};
  var _isLeapYear;
  var _getDaysInMonth;
  var _toAvailableFormatsKeys;
  var _expandAvailableDateFormatsPattern;
  var _expandAvailableTimeFormatsPattern;
  var _basicFormatMatcher;
  var _appendToKey;
  var _getDaysDif;
  var _getDayIndex;
  var _isSameYear;
  var _isNextYear;
  var _isPrevYear;
  var _isSameMonth;
  var _isNextMonth;
  var _isPrevMonth;
  var _isSameWeek;
  var _isNextWeek;
  var _isPrevWeek;
  var _isSameDay;
  var _isNextDay;
  var _isPrevDay;
  var _expandYear;
  var _getTokenIndex;
  var _parseLenient;
  var _parseLenientyMEd;
  var _parseLenientyMMMEd;
  var _parseLenienthms;
  var _getDayIndex1;
  var _getResolvedDefaultOptions;
  var _getMonthIndex;
  var _getPredefinedStylesResolvedOptions;
  var _getResolvedOptions;
  var _getParseRegExp;
  var _getPatternResolvedOptions;
  var _getECMAResolvedOptions;
  var _getRelativeTimeResolvedOptions;
  var _validateRange;
  var _getCompareISODatesOptions;
  var _arrayIndexOfDay;
  var _getLocaleDecimalSeparator;
  var _arrayIndexOfMonth;
  var _getIsoStrStyle;
  var _throwDateFormatMismatch;
  var _getPatternFromSingleToken;
  var _throwWeekdayMismatch;
  var _createParseISOStringFromDate;
  var _getParseISOStringOffset;
  var _createISOStrParts;
  var _adjustHours;
  var _getStdOffset;
  var _availableTimeZonesImpl;
  var _getTimePart;
  var _getNameIndex;
  var _getWeekdayName;
  var _getMetazone;
  var _parseMetaDate;
  var _getTimezoneName;
  var _getTimeZone;
  var _parseZone;
  var _convertToLocalDate;
  var _getTimeDiff;
  var _replaceParams;
  var _formatRelativeCalendar;
  var _formatRelativeDisplayName;
  var _formatRelativeImplicit;
  var _getBCP47Lang;
  var _getUnits;
  var _daysToMonths;

  var _YEAR_AND_DATE_REGEXP = /(\d{1,4})\D+?(\d{1,4})/g;
  var _YMD_REGEXP = /(\d{1,4})\D+?(\d{1,4})\D+?(\d{1,4})/g;
  var _MONTH_REGEXP_FMT = /^[M][^M]|[^M]M[^M]|[^M]M$|^M$/g;
  var _MONTH_REGEXP_STD = /^[L][^L]|[^L]L[^L]|[^L]L$|^L$/g;
  var _DAY_REGEXP = /^[d][^d]|[^d]d[^d]|[^d]d$|^d$|^d[^d]/;
  var _HOUR_REGEXP = /(?:^|[^h])h[^h]|[^H]H[^H]|[^k]k[^k]|[^K]K[^K]|^H[^H]|^H$|[^h]h$/;
  var _COMMENT_REGEXP = /'.*'/;
  var _DAY_COMMENT_REGEXP = /'[^d]*d[^d]*'/;
  var _TIME_REGEXP = /(\d{1,2})(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,2}))?(?:\D+?(\d{1,3}))?/g;
  var _TIME_FORMAT_REGEXP = /h|H|K|k/g;
  var _ESCAPE_REGEXP = /([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g;
  var _TOKEN_REGEXP = /ccccc|cccc|ccc|cc|c|EEEEE|EEEE|EEE|EE|E|dd|d|MMMMM|MMMM|MMM|MM|M|LLLLL|LLLL|LLL|LL|L|yyyy|yy|y|hh|h|HH|H|KK|K|kk|k|mm|m|ss|s|aa|a|SSS|SS|S|zzzz|zzz|zz|z|v|ZZZ|ZZ|Z|XXX|XX|X|VV|GGGGG|GGGG|GGG|GG|G/g;
  var _TIME_FORMATS_Z_TOKENS = /\s?(?:\(|\[)?z{1,4}(?:\)|\])?/g;
  var tzNotSupported = false;
  var _DAYS_INDEXES = {
    0: "sun",
    1: "mon",
    2: "tue",
    3: "wed",
    4: "thu",
    5: "fri",
    6: "sat"
  };

  var _THRESHOLDS = {
    s: 46, // seconds to minute
    m: 46, // minutes to hour
    h: 23, // hours to day
    d: 7, // days to week
    w: 4, //weeks to 
    M: 12   // months to year
  };

  var _ZULU = 'zulu';
  var _LOCAL = 'local';
  var _AUTO = 'auto';
  var _INVARIANT = 'invariant';
  var _OFFSET = 'offset';
  var _UTC = 'UTC';

  var _ALNUM_REGEXP = '(\\D+|\\d\\d?\\D|\\d\\d?|\\D+\\d\\d?)',
      _NON_DIGIT_REGEXP = '(\\D+|\\D+\\d\\d?)',
      _NON_DIGIT_OPT_REGEXP = '(\\D*)',
      _STR_REGEXP = '(.+?)',
      _TWO_DIGITS_REGEXP = '(\\d\\d?)',
      _THREE_DIGITS_REGEXP = '(\\d{1,3})',
      _FOUR_DIGITS_REGEXP = '(\\d{1,4})',
      _TZ_HM_REGEXP = '([+-]?\\d{1,4})',
      _TZ_H_REGEXP = '([+-]?\\d{1,2})',
      _TZ_H_SEP_M_REGEXP = '([+-]?\\d{1,2}:\\d{1,2})',
      _SLASH_REGEXP = '(\\/)';

  var _PROPERTIES_MAP = {
    'MMM': {
      'token': 'months',
      'style': 'format',
      'mLen': 'abbreviated',
      'matchIndex': 0,
      'key': 'month',
      'value': 'short',
      'regExp': _ALNUM_REGEXP
    },
    'MMMM': {
      'token': 'months',
      'style': 'format',
      'mLen': 'wide',
      'matchIndex': 0,
      'key': 'month',
      'value': 'long',
      'regExp': _ALNUM_REGEXP
    },
    'MMMMM': {
      'token': 'months',
      'style': 'format',
      'mLen': 'narrow',
      'matchIndex': 0,
      'key': 'month',
      'value': 'narrow',
      'regExp': _ALNUM_REGEXP
    },
    'LLL': {
      'token': 'months',
      'style': 'stand-alone',
      'mLen': 'abbreviated',
      'matchIndex': 1,
      'key': 'month',
      'value': 'short',
      'regExp': _ALNUM_REGEXP
    },
    'LLLL': {
      'token': 'months',
      'style': 'stand-alone',
      'mLen': 'wide',
      'matchIndex': 1,
      'key': 'month',
      'value': 'long',
      'regExp': _ALNUM_REGEXP
    },
    'LLLLL': {
      'token': 'months',
      'style': 'stand-alone',
      'mLen': 'narrow',
      'matchIndex': 1,
      'key': 'month',
      'value': 'narrow',
      'regExp': _ALNUM_REGEXP
    },
    'E': {
      'token': 'days',
      'style': 'format',
      'dLen': 'abbreviated',
      'matchIndex': 0,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'EE': {
      'token': 'days',
      'style': 'format',
      'dLen': 'abbreviated',
      'matchIndex': 0,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'EEE': {
      'token': 'days',
      'style': 'format',
      'dLen': 'abbreviated',
      'matchIndex': 0,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'EEEE': {
      'token': 'days',
      'style': 'format',
      'dLen': 'wide',
      'matchIndex': 0,
      'key': 'weekday',
      'value': 'long',
      'regExp': _NON_DIGIT_REGEXP
    },
    'EEEEE': {
      'token': 'days',
      'style': 'format',
      'dLen': 'narrow',
      'matchIndex': 0,
      'key': 'weekday',
      'value': 'narrow',
      'regExp': _NON_DIGIT_REGEXP
    },
    'c': {
      'token': 'days',
      'style': 'stand-alone',
      'dLen': 'abbreviated',
      'matchIndex': 1,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'cc': {
      'token': 'days',
      'style': 'stand-alone',
      'dLen': 'abbreviated',
      'matchIndex': 1,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'ccc': {
      'token': 'days',
      'style': 'stand-alone',
      'dLen': 'abbreviated',
      'matchIndex': 1,
      'key': 'weekday',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'cccc': {
      'token': 'days',
      'style': 'stand-alone',
      'dLen': 'wide',
      'matchIndex': 1,
      'key': 'weekday',
      'value': 'long',
      'regExp': _NON_DIGIT_REGEXP
    },
    'ccccc': {
      'token': 'days',
      'style': 'stand-alone',
      'dLen': 'narrow',
      'matchIndex': 1,
      'key': 'weekday',
      'value': 'narrow',
      'regExp': _NON_DIGIT_REGEXP
    },
    'h': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 11,
      'start2': 1,
      'end2': 12,
      'key': 'hour',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'hh': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 11,
      'start2': 1,
      'end2': 12,
      'key': 'hour',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'K': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 11,
      'start2': 0,
      'end2': 11,
      'key': 'hour',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'KK': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 11,
      'start2': 0,
      'end2': 11,
      'key': 'hour',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'H': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 23,
      'start2': 0,
      'end2': 23,
      'key': 'hour',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'HH': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 23,
      'start2': 0,
      'end2': 23,
      'key': 'hour',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'k': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 23,
      'start2': 1,
      'end2': 24,
      'key': 'hour',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'kk': {
      'token': 'time',
      'timePart': 'hour',
      'start1': 0,
      'end1': 23,
      'start2': 1,
      'end2': 24,
      'key': 'hour',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'm': {
      'token': 'time',
      'timePart': 'minute',
      'start1': 0,
      'end1': 59,
      'start2': 0,
      'end2': 59,
      'key': 'minute',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'mm': {
      'token': 'time',
      'timePart': 'minute',
      'start1': 0,
      'end1': 59,
      'start2': 0,
      'end2': 59,
      'key': 'minute',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    's': {
      'token': 'time',
      'timePart': 'second',
      'start1': 0,
      'end1': 59,
      'start2': 0,
      'end2': 59,
      'key': 'second',
      'value': 'numeric',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'ss': {
      'token': 'time',
      'timePart': 'second',
      'start1': 0,
      'end1': 59,
      'start2': 0,
      'end2': 59,
      'key': 'second',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'S': {
      'token': 'time',
      'timePart': 'millisec',
      'start1': 0,
      'end1': 999,
      'start2': 0,
      'end2': 999,
      'key': 'millisecond',
      'value': 'numeric',
      'regExp': _THREE_DIGITS_REGEXP
    },
    'SS': {
      'token': 'time',
      'timePart': 'millisec',
      'start1': 0,
      'end1': 999,
      'start2': 0,
      'end2': 999,
      'key': 'millisecond',
      'value': 'numeric',
      'regExp': _THREE_DIGITS_REGEXP
    },
    'SSS': {
      'token': 'time',
      'timePart': 'millisec',
      'start1': 0,
      'end1': 999,
      'start2': 0,
      'end2': 999,
      'key': 'millisecond',
      'value': 'numeric',
      'regExp': _THREE_DIGITS_REGEXP
    },
    'd': {
      'token': 'dayOfMonth',
      'key': 'day',
      'value': 'numeric',
      'getPartIdx': 2,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'dd': {
      'token': 'dayOfMonth',
      'key': 'day',
      'value': '2-digit',
      'getPartIdx': 2,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'M': {
      'token': 'monthIndex',
      'key': 'month',
      'value': 'numeric',
      'getPartIdx': 1,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'MM': {
      'token': 'monthIndex',
      'key': 'month',
      'value': '2-digit',
      'getPartIdx': 1,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'L': {
      'token': 'monthIndex',
      'key': 'month',
      'value': 'numeric',
      'getPartIdx': 1,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'LL': {
      'token': 'monthIndex',
      'key': 'month',
      'value': '2-digit',
      'getPartIdx': 1,
      'regExp': _TWO_DIGITS_REGEXP
    },
    'y': {
      'token': 'year',
      'key': 'year',
      'value': 'numeric',
      'regExp': _FOUR_DIGITS_REGEXP
    },
    'yy': {
      'token': 'year',
      'key': 'year',
      'value': '2-digit',
      'regExp': _TWO_DIGITS_REGEXP
    },
    'yyyy': {
      'token': 'year',
      'key': 'year',
      'value': 'numeric',
      'regExp': _FOUR_DIGITS_REGEXP
    },
    'a': {
      'token': 'ampm',
      'key': 'hour12',
      'value': true,
      'regExp': _NON_DIGIT_OPT_REGEXP
    },
    'z': {
      'token': 'tzAbbrev',
      'regExp': _STR_REGEXP
    },
    'v': {
      'token': 'tzAbbrev',
      'key': 'timeZoneName',
      'value': 'short',
      'regExp': _STR_REGEXP
    },
    'zz': {
      'token': 'tzAbbrev',
      'regExp': _STR_REGEXP
    },
    'zzz': {
      'token': 'tzAbbrev',
      'regExp': _STR_REGEXP
    },
    'zzzz': {
      'token': 'tzFull',
      'regExp': _STR_REGEXP
    },
    'Z': {
      'token': 'tzhm',
      'regExp': _TZ_HM_REGEXP
    },
    'ZZ': {
      'token': 'tzhm',
      'regExp': _TZ_HM_REGEXP
    },
    'ZZZ': {
      'token': 'tzhm',
      'regExp': _TZ_HM_REGEXP
    },
    'X': {
      'token': 'tzh',
      'regExp': _TZ_H_REGEXP
    },
    'XX': {
      'token': 'tzhm',
      'key': 'XX',
      'regExp': _TZ_HM_REGEXP
    },
    'XXX': {
      'token': 'tzhsepm',
      'regExp': _TZ_H_SEP_M_REGEXP
    },
    'VV': {
      'token': 'tzid',
      'regExp': _STR_REGEXP
    },
    'G': {
      'token': 'era',
      'key': 'era',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'GG': {
      'token': 'era',
      'key': 'era',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'GGG': {
      'token': 'era',
      'key': 'era',
      'value': 'short',
      'regExp': _NON_DIGIT_REGEXP
    },
    'GGGG': {
      'token': 'era',
      'key': 'era',
      'value': 'long',
      'regExp': _NON_DIGIT_REGEXP
    },
    'GGGGG': {
      'token': 'era',
      'key': 'era',
      'value': 'narrow',
      'regExp': _NON_DIGIT_REGEXP
    },
    '/': {
      'token': 'slash',
      'regExp': _SLASH_REGEXP
    }
  };


  /*
   *Helper functions
   */
  _get2DigitYearStart = function (options) {
    var option = options['two-digit-year-start'];
    if (option === undefined || isNaN(option))
      option = 1950;
    option = parseInt(option, 10);
    return option;
  };

  //Each locale has 12 or 24 hour preferred format
  _isHour12 = function (localeElements) {
    var locale = localeElements['_ojLocale_']
    var territory = OraI18nUtils.getBCP47Region(locale);
    var prefferedHours = localeElements['supplemental']['prefferedHours'];
    var hour12 = prefferedHours[territory];
    return hour12 === 'h';
  };

  _isLeapYear = function (y) {
    if (y % 400 === 0)
      return true;
    else if (y % 100 === 0)
      return false;
    else if (y % 4 === 0)
      return true;
    else
      return false;
  };

  _getDaysInMonth = function (y, m) {
    switch (m) {
      case 0 :
      case 2 :
      case 4 :
      case 6 :
      case 7 :
      case 9 :
      case 11 :
        return 31;
      case 1:
        if (_isLeapYear(y))
          return 29;
        else
          return 28;
      default:
        return 30;
    }
  };

  //returns the locale's pattern from the predefined styles.
  //EX: for en-US dateFormat:"full" returns the pattern "EEEE, MMMM d, y".
  _expandPredefinedStylesFormat = function (options, localeElements, caller) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var fmtType = getOption('formatType', 'string', ['date', 'time',
      'datetime'], 'date');
    var dStyle = getOption('dateFormat', 'string',
        ['short', 'medium', 'long', 'full'], 'short');
    var tStyle = getOption('timeFormat', 'string',
        ['short', 'medium', 'long', 'full'], 'short');
    var cal = mainNode['dates']['calendars']['gregorian'];
    var dateFormats = cal['dateFormats'];
    var timeFormats = cal['timeFormats'];

    var dStyleFmt, tStyleFmt, format;
    switch (dStyle)
    {
      case "full" :
        dStyleFmt = dateFormats['full'];
        break;
      case "long" :
        dStyleFmt = dateFormats['long'];
        break;
      case "medium" :
        dStyleFmt = dateFormats['medium'];
        break;
      case "short" :
        dStyleFmt = dateFormats['short'];
        break;
      default:
        break;
    }
    switch (tStyle)
    {
      case "full" :
        tStyleFmt = timeFormats['full'];
        break;
      case "long" :
        tStyleFmt = timeFormats['long'];
        break;
      case "medium" :
        tStyleFmt = timeFormats['medium'];
        break;
      case "short" :
        tStyleFmt = timeFormats['short'];
        break;
      default:
        break;
    }
    if (dStyleFmt !== undefined && (fmtType === "datetime" ||
        fmtType === "date"))
      format = dStyleFmt;
    if (tStyleFmt !== undefined && (fmtType === "datetime" ||
        fmtType === "time")) {
      if (tzNotSupported) {
        tStyleFmt = tStyleFmt.replace(_TIME_FORMATS_Z_TOKENS, '');

      }
      if (format)
        format = format + " " + tStyleFmt;
      else
        format = tStyleFmt;
    }
    return format;
  };

  // appends pre- and post- token match strings while removing escaped 
  // characters.
  // Returns a single quote count which is used to determine if the 
  // token occurs
  // in a string literal.
  _appendPreOrPostMatch = function (preMatch, strings) {
    var quoteCount = 0;
    var escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
      var c = preMatch.charAt(i);
      switch (c) {
        case "\'":
          if (escaped) {
            strings.push("\'");
          }
          else {
            quoteCount++;
          }
          escaped = false;
          break;
        case "\\":
          if (escaped) {
            strings.push("\\");
          }
          escaped = !escaped;
          break;
        default:
          strings.push(c);
          escaped = false;
          break;
      }
    }
    return quoteCount;
  };

  //Throw an exception if date-time pattern is invalid
  _throwInvalidDateFormat = function (format, options, m) {
    var msg;
    var error;
    var errorInfo;
    var samplePattern;
    var isDate = options['year'] !== undefined || options['month'] !==
        undefined ||
        options['weekday'] !== undefined || options['day'] !== undefined;
    var isTime = options['hour'] !== undefined || options['minute'] !==
        undefined ||
        options['second'] !== undefined;
    if (isDate && isTime) {
      samplePattern = "MM/dd/yy hh:mm:ss a";
    }
    else if (isDate) {
      samplePattern = "MM/dd/yy";
    }
    else {
      samplePattern = "hh:mm:ss a";
    }
    msg = "Unexpected character(s) " + m + " encountered in the pattern \"" +
        format + " An example of a valid pattern is \"" + samplePattern + '".';
    error = new SyntaxError(msg);
    errorInfo = {
      'errorCode': 'optionValueInvalid',
      'parameterMap': {
        'propertyName': 'pattern',
        'propertyValue': format,
        'propertyValueHint ': samplePattern
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  //implementation of basic forat matcher algorithm from ECMA spec.
  //This impelmentation takes into consideration hour12, For example if 
  //hour12=true, H entries are removed from availableFormats in order to
  //avoid wrong matching for hour.
  _basicFormatMatcher = function (dateTimeKeys, localeElements, isDate,
      hour12)
  {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var availableFormats = mainNode['dates']['calendars']['gregorian']
    ['dateTimeFormats']['availableFormats'];
    var dateTimeFormats = ["weekday", "era", "year", "month", "day",
      "hour", "minute", "second", "timeZoneName"];
    var values = {
      '2-digit': 0,
      'numeric': 1,
      'narrow': 2,
      'short': 3,
      'long': 4
    };

    var removalPenalty = 120;
    var additionPenalty = 20;
    var longLessPenalty = 8;
    var longMorePenalty = 6;
    var shortLessPenalty = 6;
    var shortMorePenalty = 3;
    var bestScore = -Infinity;
    var bestFormat = undefined;
    var match;
    var skip;
    for (var f in availableFormats) {
      skip = false;
      var format = {};
      format['pattern'] = availableFormats[f];
      var score = 0;
      while ((match = _TOKEN_REGEXP.exec(f)) !== null) {
        var m = match[0];
        if ((m === 'h' || m === 'hh') && !hour12) {
          skip = true;
          continue;
        }
        else if ((m === 'H' || m === 'HH') && hour12) {
          skip = true;
          continue;
        }
        if (_PROPERTIES_MAP[m] !== undefined) {
          format[_PROPERTIES_MAP[m]['key']] =
              _PROPERTIES_MAP[m]['value'];
        }
      }
      if (skip)
        continue;
      for (var property in dateTimeFormats) {
        var optionsProp = dateTimeKeys[dateTimeFormats[property]];
        var formatProp = format[dateTimeFormats[property]];
        if (optionsProp === undefined && formatProp !== undefined) {
          score -= additionPenalty;
        }
        else if (optionsProp !== undefined && formatProp === undefined) {
          score -= removalPenalty;
        }
        else if (optionsProp !== undefined && formatProp !== undefined) {

          var optionsPropIndex = values[optionsProp];
          var formatPropIndex = values[formatProp];
          var delta = Math.max(Math.min(formatPropIndex -
              optionsPropIndex, 2), -2);
          if (delta === 2) {
            score -= longMorePenalty;
          }
          else if (delta === 1) {
            score -= shortMorePenalty;
          }
          else if (delta === -1) {
            score -= shortLessPenalty;
          }
          else if (delta === -2) {
            score -= longLessPenalty;
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestFormat = format;
      }
    }
    if (bestFormat !== undefined) {
      return bestFormat['pattern'];
    }
    return null;
  };

  //Return a format key from ecma options. For example:
  //{year:"2-digit", month:"long", day:"numeric", weekday:"long"};
  //will return "yyMMMMdEEEE"
  _toAvailableFormatsKeys = function (options, localeElements, caller) {
    var dateKey = '';
    var timeKey = '';
    var dateOptions = {};
    var timeOptions = {};

    var getOption = OraI18nUtils.getGetOption(options, caller);

    //date key
    var option = getOption('era', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'era',
        option, {
          'narrow': 'GGGGG',
          'short': 'GGG',
          'long': 'GGGG'
        });

    option = getOption('year', 'string', ['2-digit', 'numeric']);
    dateKey += _appendToKey(dateOptions, 'year',
        option, {
          '2-digit': 'yy',
          'numeric': 'y'
        });

    option = getOption('month', 'string', ['2-digit', 'numeric', 'narrow',
      'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'month',
        option, {
          '2-digit': 'MM',
          'numeric': 'M',
          'narrow': 'MMMMM',
          'short': 'MMM',
          'long': 'MMMM'
        });

    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    dateKey += _appendToKey(dateOptions, 'weekday',
        option, {
          'narrow': 'EEEEE',
          'short': 'E',
          'long': 'EEEE'
        });

    option = getOption('day', 'string', ['2-digit', 'numeric']);
    dateKey += _appendToKey(dateOptions, 'day',
        option, {
          '2-digit': 'dd',
          'numeric': 'd'
        });

    //time key
    var hr12 = getOption('hour12', 'boolean', [true, false]);
    if (hr12 === undefined)
      hr12 = _isHour12(localeElements);
    option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (hr12 === true) {
      timeKey += _appendToKey(timeOptions, 'hour',
          option, {
            '2-digit': 'hh',
            'numeric': 'h'
          });
    }
    else {
      timeKey += _appendToKey(timeOptions, 'hour',
          option, {
            '2-digit': 'HH',
            'numeric': 'H'
          });
    }

    option = getOption('minute', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'minute',
        option, {
          '2-digit': 'mm',
          'numeric': 'm'
        });

    option = getOption('second', 'string', ['2-digit', 'numeric']);
    timeKey += _appendToKey(timeOptions, 'second',
        option, {
          '2-digit': 'ss',
          'numeric': 's'
        });
    option = getOption('timeZoneName', 'string', ['short', 'long']);
    timeKey += _appendToKey(timeOptions, 'timeZoneName',
        option, {
          'short': 'v',
          'long': 'v'
        });

    return [dateKey, timeKey, dateOptions, timeOptions];
  };

  _appendToKey = function (obj, prop, option, pairs) {
    if (option !== undefined) {
      obj[prop] = option;
      return pairs[option];
    }
    else {
      return '';
    }
  };


  /*
   *This function is used by the munger algorith. It expands a pattern
   *in order to match the user's ECMA options.
   *For example if the user provided options is 
   *options = {year: 'numeric', month: 'long', weekday: 'long',
   *day : '2-digit'}; 
   *The key for these options is: yMMMMEEEEdd. under availableFormats, 
   *we have the following entry: "yMMMEd": "E, MMM d, y".
   *The _basicFormatMatcher algorithm will find "yMMMEd" key as the 
   *closest match to yMMMMEEEEdd. If formatMatcher ="munger", we will 
   *expand the corresponding pattern to match the options. 
   *So "E, MMM d, y" will be expanded to "EEEE, MMMM dd y".
   */
  _expandAvailableDateFormatsPattern = function (formatTemplate, options,
      caller)
  {
    var datePat = formatTemplate;
    var match;
    var getOption = OraI18nUtils.getGetOption(options, caller);
    //year
    var option = getOption('year', 'string', ['2-digit', 'numeric']);
    var pairs = {
      '2-digit': 'yy',
      'numeric': 'yyyy'
    };
    if (option !== undefined)
      datePat = datePat.replace(/y{1,4}/, pairs[option]);

    //month
    option = getOption('month', 'string', ['2-digit', 'numeric', 'narrow',
      'short', 'long']);
    if (option !== undefined) {
      pairs = {
        '2-digit': 'MM',
        'numeric': 'M',
        'narrow': 'MMMMM',
        'short': 'MMM',
        'long': 'MMMM'
      };
      var pairsL = {
        '2-digit': 'LL',
        'numeric': 'L',
        'narrow': 'LLLLL',
        'short': 'LLL',
        'long': 'LLLL'
      };
      if (pairs[option] !== undefined && pairs[option].length > 2) {
        datePat = datePat.replace(/M{3,5}/, pairs[option]);
        datePat = datePat.replace(/L{3,5}/, pairsL[option]);
      }
      else if (option === '2-digit') {
        _MONTH_REGEXP_FMT.lastIndex = 0;
        match = _MONTH_REGEXP_FMT.test(formatTemplate);
        if (match) {
          datePat = datePat.replace('M', 'MM');
        }
        match = _MONTH_REGEXP_STD.test(formatTemplate);
        if (match) {
          datePat = datePat.replace('L', 'LL');
        }
      }
    }

    //weekday
    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      var pairsFormat = {
        'narrow': 'EEEEE',
        'short': 'EEE',
        'long': 'EEEE'
      };
      var pairsStandalone = {
        'narrow': 'ccccc',
        'short': 'ccc',
        'long': 'cccc'
      };
      datePat = datePat.replace(/E{1,5}/, pairsFormat[option]);
      datePat = datePat.replace(/c{1,5}/, pairsStandalone[option]);
    }
    //day
    option = getOption('day', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      if (option === '2-digit') {
        _DAY_REGEXP.lastIndex = 0;
        _DAY_COMMENT_REGEXP.lastIndex = 0;
        var match1 = _DAY_COMMENT_REGEXP.test(formatTemplate);
        match = _DAY_REGEXP.test(formatTemplate);
        if (match == true && match1 === false) {
          datePat = datePat.replace('d', 'dd');
        }
      }
    }
    return datePat;
  };

  //Same as above for time entries
  _expandAvailableTimeFormatsPattern = function (formatTemplate, options,
      caller) {
    var timePat = formatTemplate;
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (option === '2-digit') {
      _HOUR_REGEXP.lastIndex = 0;
      _COMMENT_REGEXP.lastIndex = 0;
      var formatTemplate1 = formatTemplate.replace(_COMMENT_REGEXP, '');
      var match = _HOUR_REGEXP.exec(formatTemplate1);
      if (match !== null) {
        _TIME_FORMAT_REGEXP.lastIndex = 0;
        var match1 = _TIME_FORMAT_REGEXP.exec(match[0]);
        var ext = match1[0] + match1[0];
        timePat = formatTemplate.replace(match1[0], ext);
      }
    }
    return timePat;
  };

  _getPatternFromSingleToken = function (token, tokenObj, availableFormats) {
    var i;
    var count = 0;
    for (i in tokenObj) {
      count++;
    }
    if (count > 1) {
      return null;
    }
    var pattern;
    for (i = token.length; i > 0; i--) {
      pattern = availableFormats[token.substr(0, i)];
      if (pattern !== undefined)
        return pattern;
    }
    return token;
  };

  _expandISOFormat = function (options) {
    var format = 'yyyy-MM-ddTHH:mm:ss';
    var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter.format");
    var isoFormat = getOption('isoStrFormat', 'string',
        [_ZULU, _OFFSET, _INVARIANT, _LOCAL, _AUTO], _AUTO);
    switch (isoFormat) {
      case _ZULU:
        options['timeZone'] = 'Etc/GMT+0';
        format += "'Z'";
        break;
      case _OFFSET:
        format += 'XXX';
        break;
      default:
        break;
    }
    return format;
  };

  //Returns the localized decimal separator. Used for milliseconds
  _getLocaleDecimalSeparator = function (localeElements, locale) {
    var numberingSystemKey = OraI18nUtils.getNumberingSystemKey(localeElements, locale);
    var numberingSystem = "symbols-numberSystem-" + numberingSystemKey;
    return localeElements['numbers'][numberingSystem]['decimal'];
  }

  //Returns a pattern corresponding to user's options.
  //Cache the entries for which we already found a pattern 
  _expandFormat = function (options, localeElements, mlocale, caller) {
    function substituteTokens(cachedVal) {
      if (msOption !== undefined) {
        var sep = _getLocaleDecimalSeparator(mainNode, mlocale);
        if (hOption === undefined && mOption === undefined && sOption === undefined) {
          sep = "S";
        }
        else {
          sep = "ss" + sep + "SSS";
        }
        cachedVal = cachedVal.replace("ss", sep);
        if (sOption === undefined) {
          options['second'] = undefined;
        }
      }
      //substitute time zone token v  based on short or long
      var option = getOption('timeZoneName', 'string', ['short', 'long']);
      var pairs = {
        'short': 'z',
        'long': 'zzzz'
      };
      if (option !== undefined) {
        cachedVal = cachedVal.replace(/v/, pairs[option]);
      }
      return cachedVal;
    }

    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var pattern;
    var matcher = getOption('formatMatcher', 'string',
        ['basic', 'munger'], 'munger');
    var count = 0;
    for (count in options) {
      count++;
    }
    if (count === 0) {
      options = {
        'year': 'numeric',
        'month': 'numeric',
        'day': 'numeric'
      };
    }
    var hOption;
    var mOption;
    var sOption;
    var msOption;
    //append millisecnods to pattern
    msOption = getOption('millisecond', 'string', ['numeric', '2-digit']);
    sOption = getOption('second', 'string', ['numeric', '2-digit']);
    if (msOption !== undefined) {
      hOption = getOption('hour', 'string', ['numeric', '2-digit']);
      mOption = getOption('minute', 'string', ['numeric', '2-digit']);
      options['second'] = '2-digit';
    }

    var dateTimeKeys = _toAvailableFormatsKeys(options, localeElements, caller);
    //First try to get the pattern from cache
    if (_localeDataCache[locale] !== undefined) {
      var cachedPattern = _localeDataCache[locale]['dates']['calendars']['gregorian']
      ['dateTimeFormats'][dateTimeKeys[0] + dateTimeKeys[1]];
      if (cachedPattern !== undefined) {
        cachedPattern = substituteTokens(cachedPattern);
        return cachedPattern;
      }
    }
    if (dateTimeKeys[0] === '' && dateTimeKeys[1] === '') {
      return _expandPredefinedStylesFormat(options, localeElements,
          caller);
    }
    var availableFormats = mainNode['dates']['calendars']['gregorian']
    ['dateTimeFormats']['availableFormats'];
    var datePattern = availableFormats[dateTimeKeys[0]];
    var hour12 = getOption('hour12', 'boolean', [true, false]);
    if (hour12 === undefined)
      hour12 = _isHour12(localeElements);
    if (datePattern === undefined && dateTimeKeys[0] !== '') {
      datePattern = _getPatternFromSingleToken(dateTimeKeys[0], dateTimeKeys[2],
          availableFormats);
      if (datePattern === null)
        datePattern = _basicFormatMatcher(dateTimeKeys[2],
            localeElements, true, hour12);
      if (datePattern !== null) {
        if (matcher !== 'basic') {
          datePattern = _expandAvailableDateFormatsPattern(
              datePattern, options, caller);
        }
      }
      else
        datePattern = dateTimeKeys[0];
    }
    var timePattern = availableFormats[dateTimeKeys[1]];
    if (timePattern === undefined && dateTimeKeys[1] !== '') {
      timePattern = _getPatternFromSingleToken(dateTimeKeys[1], dateTimeKeys[3],
          availableFormats);
      if (timePattern === null)
        timePattern = _basicFormatMatcher(dateTimeKeys[3],
            localeElements, true, hour12);
      if (timePattern !== null) {
        if (matcher !== 'basic') {
          timePattern = _expandAvailableTimeFormatsPattern(
              timePattern, options, caller);
        }
      }
      else
        timePattern = dateTimeKeys[1];
    }
    pattern = datePattern || '';
    if (timePattern !== undefined)
    {
      if (pattern !== '')
        pattern += ' ' + timePattern;
      else
        pattern = timePattern;
    }

    //cache the pattern
    if (_localeDataCache[locale] === undefined) {
      _localeDataCache[locale] = {};
      _localeDataCache[locale]['dates'] = {};
      _localeDataCache[locale]['dates']['calendars'] = {};
      _localeDataCache[locale]['dates']['calendars']['gregorian'] = {};
      _localeDataCache[locale]['dates']['calendars']['gregorian']
      ['dateTimeFormats'] = {};
    }
    _localeDataCache[locale]['dates']['calendars']['gregorian']
    ['dateTimeFormats'][dateTimeKeys[0] + dateTimeKeys[1]] = pattern;
    pattern = substituteTokens(pattern);
    return pattern;
  };

  _parseMetaDate = function (str) {
    var parts = str.split(' ');
    var dParts = parts[0].split('-');
    var d = new Date(dParts[0], dParts[1] - 1, dParts[2]);
    if (parts.length > 1) {
      dParts = parts[1].split(':');
      d.setHours(dParts[0]);
      d.setMinutes(dParts[1]);
    }
    return d.getTime();
  };

  _getMetazone = function (value, zoneName, metazones) {
    var now = new Date(value[0], value[1] - 1, value[2],
        value[3], value[4], value[5]);
    now = now.getTime();
    var parts = zoneName.split('/');
    var country = parts[0];
    var city = parts[1];
    var zone = metazones[country];
    if (zone === undefined)
      return null;
    zone = zone[city];
    if (zone === undefined) {
      return null;
    }
    var i, length = zone.length;
    var mzoneStartTime;
    var mzoneEndTime;
    var mzoneStart;
    var mzoneEnd;
    var mzoneName;

    for (i = 0; i < length; i++) {
      mzoneStart = zone[i]['usesMetazone']['_from'];
      mzoneEnd = zone[i]['usesMetazone']['_to'];
      mzoneName = zone[i]['usesMetazone']['_mzone'];
      //time zone never chnaged. _to and _from undefined
      if (mzoneStart === undefined && mzoneEnd === undefined) {
        return mzoneName;
      }
      //_from undefined. check if  now <= _to
      if (mzoneStart === undefined && mzoneEnd !== undefined) {
        mzoneEndTime = _parseMetaDate(mzoneEnd);
        if (now <= mzoneEndTime)
          return mzoneName;
      }
      //_to undefined. check if  now >= _from
      if (mzoneStart !== undefined && mzoneEnd === undefined) {
        mzoneStartTime = _parseMetaDate(mzoneStart);
        if (now >= mzoneStartTime)
          return mzoneName;
      }
      // find interval where now falls between _to and _from
      if (mzoneStart !== undefined && mzoneEnd !== undefined) {
        mzoneStartTime = _parseMetaDate(mzoneStart);
        mzoneEndTime = _parseMetaDate(mzoneEnd);
        if (now >= mzoneStartTime && now < mzoneEndTime) {
          return mzoneName;
        }
      }
    }
  };

  //value is the  utc date. Used to determinse if dst or not
  //options, param passed to the converter
  //len = 0, return short timezone name; 1, return long timezone
  //isTimeOnly is used to determine of we should igonore dst
  _getTimezoneName = function (localeElements, value, options, len, isTimeOnly) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var zoneName = "";
    var timeZone = options['timeZone'];
    var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter");
    var dst = getOption('dst', 'boolean', [true, false], false);
    if (timeZone === undefined) {
      return zoneName;
    }
    var metazones = localeElements['supplemental']['metazones'];
    var metaZone = _getMetazone(value, timeZone, metazones);
    var zoneNameEntry0;
    var tzLong = 'long';
    var tzShort = 'short';
    var during = 'standard';
    var ignoreDst = isTimeOnly ? false : true;
    var zone = _getTimeZone(timeZone, localeElements);
    var index = _parseZone(zone, value, dst, ignoreDst, true);
    if (mainNode['dates']['timeZoneNames']['metazone'] !== undefined) {
      zoneNameEntry0 = mainNode['dates']['timeZoneNames']['metazone'][metaZone];
    }
    if (zoneNameEntry0 === undefined) {
      var offset = zone.ofset(index);
      return OraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
    }
    var zoneNameEntry;
    if (len === 1) {
      zoneNameEntry = zoneNameEntry0[tzLong];
    }
    else {
      zoneNameEntry = zoneNameEntry0[tzShort];
    }
    var offset1 = zone.ofset(index);
    var offset2 = zone.ofset(index + 1);
    if (offset1 < offset2) {
      during = 'daylight';
    }
    if (zoneNameEntry !== undefined) {
      zoneName = zoneNameEntry[during];
      if (zoneName !== undefined)
        return zoneName;
    }
    //return UTC offset if we can not find a timezone name.
    return OraI18nUtils.getTimeStringFromOffset(_UTC, offset1, true, true);
  };

  _getTimeZone = function (timeZoneId, localeElements) {
    var tz = OraTimeZone.getInstance();
    var zone = tz.getZone(timeZoneId, localeElements);
    return zone;
  };

  _parseZone = function (zone, parts, dst, ignoreDst, dateTime) {
    var utcDate = Date.UTC(parts[0], parts[1] - 1, parts[2],
        parts[3], parts[4], parts[5]);
    var index = zone.parse(utcDate, dst, ignoreDst, dateTime);
    return index;
  };

  _formatImpl = function (localeElements, options, isoStrInfo, locale) {
    var ret;
    var format;
    var value = isoStrInfo['isoStrParts'];
    var isTimeOnly = isoStrInfo['dateTime'].indexOf('T') === 0;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter.format");
    //get the pattern from options
    format = options['pattern'] || _expandFormat(options, localeElements,
        locale, "OraDateTimeConverter.format");
    // Start with an empty string
    ret = [];
    var part,
        quoteCount = 0,
        cal = mainNode['dates']['calendars']['gregorian'];

    function _getPart(date, part) {
      switch (part) {
        case 0:
          return date[0];
        case 1:
          return date[1];
        case 2:
          return date[2];
        case 3:
          var dt = new Date(date[0], date[1] - 1, date[2],
              date[3], date[4], date[5]);
          return _DAYS_INDEXES[dt.getDay()];
      }
    }

    function _getPaddedPart(ret, value, idx, len) {
      var val = _getPart(value, idx);
      ret.push(len > 1 ? OraI18nUtils.padZeros(val, len) : val);
    }

    function _getTimeParts(ret, value, len, currentPart, current) {
      var val;
      switch (currentPart['timePart']) {
        case 'hour' :
          if (currentPart['end1'] === 11)
            val = value[3] % 12;
          else
            val = value[3];
          if (current === 'h' || current === 'hh') {
            if (val === 0)
              val = 12;
          }
          else if (current === 'k' || current === 'kk') {
            if (val === 0)
              val = 24;
          }
          break;
        case 'minute' :
          val = value[4];
          break;
        case 'second' :
          if (options['second'] === undefined && options['millisecond'] !== undefined)
            val = 0;
          else
            val = value[5];
          break;
        case 'millisec' :
          //val = OraI18nUtils.zeroPad("" + value[6], 3, true);          
          val = value[6];
          break;
      }
      ret.push(len > 1 ? OraI18nUtils.padZeros(val, len) : val);
    }

    function _getTimezoneOffset(value, options, isTimeOnly) {
      var offset;
      var zone;
      var index;
      var timeZone = options['timeZone'];
      var dst = getOption('dst', 'boolean', [true, false], false);
      var ignoreDst = isTimeOnly ? false : true;
      if (timeZone !== undefined) {
        zone = _getTimeZone(timeZone, localeElements);
        index = _parseZone(zone, value, dst, ignoreDst, true);
        offset = -zone.ofset(index);
      }
      else if (isoStrInfo['format'] !== _LOCAL) {
        switch (isoStrInfo['format']) {
          case _OFFSET :
            offset = isoStrInfo['timeZone'].split(":");
            var hoursOffset = parseInt(offset[0], 10);
            var minOffset = parseInt(offset[1], 10);
            offset = (hoursOffset * 60) +
                (OraI18nUtils.startsWith(isoStrInfo['timeZone'], "-") ? -minOffset : minOffset);
            break;
          case _ZULU :
            offset = 0;
            break;
          default:
            offset = 0;
            break;
        }
      }
      return offset;
    }

    //adjust the offset based on the offset of input iso str and timeZone attribute
    //EX: if the input iso str is one of the following:
    //2014-06-01T16:00:00-07:00
    //2014-06-01T16:00:00Z
    var timeZone = options['timeZone'];
    if (isoStrInfo['format'] !== _LOCAL && timeZone !== undefined) {
      _adjustHours(isoStrInfo, options, localeElements);
    }

    for (; ; ) {
      // Save the current index
      var index = _TOKEN_REGEXP.lastIndex,
          // Look for the next pattern
          ar = _TOKEN_REGEXP.exec(format);

      // Append the text before the pattern (or the end of the string if 
      // not found)
      var preMatch = format.slice(index, ar ? ar.index : format.length);
      quoteCount += _appendPreOrPostMatch(preMatch, ret);

      if (!ar) {
        break;
      }

      // do not replace any matches that occur inside a string literal.
      if (quoteCount % 2) {
        ret.push(ar[0]);
        continue;
      }

      var current = ar[ 0 ],
          clength = current.length,
          currentPart = _PROPERTIES_MAP[current];
      switch (currentPart['token']) {
        case 'days':
          part = cal[currentPart['token']][currentPart['style']][currentPart['dLen']];
          ret.push(part[_getPart(value, 3)]);
          break;
        case 'months':
          part = cal[currentPart['token']][currentPart['style']][currentPart['mLen']];
          ret.push(part[_getPart(value, 1)]);
          break;
        case 'dayOfMonth' :
        case 'monthIndex' :
          ret.push(_getPaddedPart(ret, value, currentPart['getPartIdx'], clength));
          break;
        case 'year':
          // Year represented by four full digits
          part = value[0];
          if (clength === 2) {
            part = part % 100;
          }
          ret.push(OraI18nUtils.padZeros(part, clength));
          break;
        case 'time':
          _getTimeParts(ret, value, clength, currentPart, current);
          break;
        case "ampm":
          // Multicharacter am/pm indicator
          part = value[3] < 12 ?
              cal['dayPeriods']['format']['wide']['am'] :
              cal['dayPeriods']['format']['wide']['pm'];
          ret.push(part);
          break;
        case "tzhm":
          // Time zone hours minutes: -0800 
          part = _getTimezoneOffset(value, options, isTimeOnly);
          if (part === 0) {
            if (currentPart['key'] === 'XX')
              ret.push('Z');
            else
              ret.push("+0000");
          }
          else {
            ret.push(
                (part <= 0 ? "-" : "+") +
                OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2) +
                OraI18nUtils.padZeros(Math.floor(Math.abs(part % 60)), 2)
                );
          }
          break;
        case "tzhsepm":
          // Time zone hours minutes: -08:00 
          part = _getTimezoneOffset(value, options, isTimeOnly);
          if (part === 0) {
            ret.push("Z");
          }
          else {
            ret.push(
                (part <= 0 ? "-" : "+") +
                OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2) +
                ":" +
                OraI18nUtils.padZeros(Math.floor(Math.abs(part % 60)), 2)
                );
          }
          break;
        case "tzh":
          // Time zone hours: -08 
          part = _getTimezoneOffset(value, options, isTimeOnly);
          if (part === 0) {
            ret.push("Z");
          }
          else {
            ret.push(
                (part <= 0 ? "-" : "+") +
                OraI18nUtils.padZeros(Math.floor(Math.abs(part / 60)), 2));
          }
          break;
        case "tzid":
          // Time zone ID: America/Los_Angeles 
          if (timeZone !== undefined)
            part = timeZone;
          else if (isoStrInfo['format'] === _ZULU) {
            part = _UTC;
          }
          else
            part = "";
          ret.push(part);
          break;
        case "tzAbbrev":
          // Time zone abbreviation: PDT, PST 
          part = _getTimezoneName(localeElements, value, options, 0, isTimeOnly);
          ret.push(part);
          break;
        case "tzFull":
          // Time zone Full: Pacific Standard Time 
          part = _getTimezoneName(localeElements, value, options, 1, isTimeOnly);
          ;
          ret.push(part);
          break;
        case "era":
          part = cal['eras']['eraAbbr'];
          ret.push(part['1']);
          break;
        case "slash":
          ret.push("/");
          break;
        default:
          _throwInvalidDateFormat(format, options, current);
      }
    }
    return ret.join("");
  };


  //_formatRelativeImpl

  //d1 and d2 same year
  _isSameYear = function (d1, d2) {
    return d1.getFullYear() === d2.getFullYear();
  };

  //d2 is next year
  _isNextYear = function (d1, d2) {
    return d2.getFullYear() - d1.getFullYear() === 1;
  };

  //d2 is previous year
  _isPrevYear = function (d1, d2) {
    return _isNextYear(d2, d1);
  };

  //d2 and d1 same month 
  _isSameMonth = function (d1, d2) {
    return _isSameYear(d1, d2) && (d1.getMonth() === d2.getMonth());
  };

  //d2 is next month
  _isNextMonth = function (d1, d2) {
    if (_isSameYear(d1, d2))
      return (d2.getMonth() - d1.getMonth()) === 1;
    else if (_isNextYear(d1, d2)) {
      return d1.getMonth() === 11 && (d2.getMonth() === 0);
    }
    return false;
  };

  //d2 is previous month
  _isPrevMonth = function (d1, d2) {
    return _isNextMonth(d2, d1);
  };

  //difference in days between d2 and d1. Only valid if d2 is same or 
  //next month of d1
  _getDaysDif = function (d1, d2) {
    var day1 = d1.getDate();
    var day2 = d2.getDate();
    if (_isNextMonth(d1, d2)) {
      day2 += _getDaysInMonth(d1.getFullYear, d1.getMonth());
    }
    return day2 - day1;
  };

  _getDayIndex = function (localeElements, idx) {
    var locale = localeElements['_ojLocale_'];
    var territory = OraI18nUtils.getBCP47Region(locale);
    var firstDayNode = localeElements['supplemental']['weekData']['firstDay'];
    var firstDayOfweek = firstDayNode[territory];
    if (firstDayOfweek === undefined)
      firstDayOfweek = firstDayNode['001'];
    var ret = idx - firstDayOfweek;
    if (ret < 0)
      ret += 7;
    return ret;
  };

  //d1 and d2 same week
  _isSameWeek = function (localeElements, d1, d2) {
    if (d1 > d2) {
      //swap dates to make sure we work with positive numbers
      var tmp = d1;
      d1 = d2;
      d2 = tmp;
    }
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2)))
      return false;
    var dif = _getDaysDif(d1, d2) +
        _getDayIndex(localeElements, d1.getDay());
    return dif >= 0 && dif <= 6;
  };

  //d2 is next week
  _isNextWeek = function (localeElements, d1, d2) {
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2)))
      return false;
    var dif = _getDaysDif(d1, d2) +
        _getDayIndex(localeElements, d1.getDay());
    return dif >= 7 && dif <= 13;
  };

  //d2 is previous week
  _isPrevWeek = function (localeElements, d1, d2) {
    return _isNextWeek(localeElements, d2, d1);
  };

  //d1 and d2 same day
  _isSameDay = function (d1, d2) {
    return _isSameYear(d1, d2) && _isSameMonth(d1, d2) &&
        (d1.getDate() === d2.getDate());
  };

  //d2 is next day
  _isNextDay = function (d1, d2) {
    if ((!_isSameMonth(d1, d2)) && (!_isNextMonth(d1, d2))) {
      return false;
    }
    return (_getDaysDif(d1, d2) === 1);
  };

  //d2 is previous day
  _isPrevDay = function (d1, d2) {
    return _isNextDay(d2, d1);
  };

  _convertToLocalDate = function (d, localeElements, options) {
    var srcTimeZone = options['timeZone'];
    var isoInfo = OraI18nUtils.getISOStrFormatInfo(d);
    var isoInfoFormat = isoInfo['format'];
    //first test id d is local
    if (isoInfoFormat === _LOCAL && srcTimeZone === undefined) {
      return d;
    }
    //first, convert to zulu
    var tzOptions = {isoStrFormat: 'zulu'};
    if (srcTimeZone !== undefined) {
      tzOptions['timeZone'] = srcTimeZone;
      tzOptions['dst'] = true;
    }
    var zuluDate = _parseImpl(d, localeElements, tzOptions, "en-US");
    //second, convert to local date
    var localOffset = OraI18nUtils.getLocalTimeZoneOffset();
    tzOptions = {timeZone: localOffset, isoStrFormat: 'local'};
    var localDate = _parseImpl(zuluDate['value'], localeElements, tzOptions, "en-US");
    return localDate['value'];
  };

  _getTimeDiff = function (d1, d2, isCalendar) {
    var datetime1 = OraI18nUtils._IsoStrParts(d1);
    var datetime2 = OraI18nUtils._IsoStrParts(d2);

    if (isCalendar) {
      //for calendar, normalize the times to midnight so that the diff is the same
      // regardless of time of day.
      datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], 0, 0, 0, 0);
      datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], 0, 0, 0, 0);
    }
    else {
      datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], datetime1[3], datetime1[4], datetime1[5], datetime1[6]);
      datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], datetime2[3], datetime2[4], datetime2[5], datetime2[6]);
    }
    return  (datetime1 - datetime2);
  };

  _replaceParams = function (string, replacements) {
    return string.replace(/\{(\d+)\}/g, function () {
      return replacements[arguments[1]];
    });
  };

  _formatRelativeCalendar = function (now, relativeDate, localeElements, dateOnly) {
    var datePart;
    var timePart;
    var relativeDay;
    var dayIndex;
    var timePartOptions = {hour: 'numeric', minute: 'numeric'};
    var elseOptions = {year: 'numeric', month: 'numeric', day: 'numeric'};
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var pattern = mainNode['dates']['calendars']['gregorian']['dateTimeFormats']['long'];
    var days = mainNode['dates']['calendars']['gregorian']['days']['format']['wide'];
    var fields = mainNode['dates']['fields'];

    var value = OraI18nUtils.isoToLocalDate(relativeDate);
    var localNow = OraI18nUtils.isoToLocalDate(now);
    var isoStrInfo = OraI18nUtils.getISOStrFormatInfo(relativeDate);

    if (_isSameDay(localNow, value))
      datePart = fields['day']['relative-type-0'];
    else if (_isNextDay(localNow, value))
      datePart = fields['day']['relative-type-1'];
    else if (_isPrevDay(localNow, value))
      datePart = fields['day']['relative-type--1'];
    else {
      relativeDay = value.getDay();
      dayIndex = _DAYS_INDEXES[relativeDay];
      var diff = _getTimeDiff(relativeDate, now, true);
      diff = diff / 864e5; //number of days
      if (diff < -1 && diff > -7) {
        datePart = fields[dayIndex]['relative-type--1'];
      }
      //next week
      else if (diff > 1 && diff < 7) {
        datePart = days[dayIndex];
      }
      //everything else
      else {
        return _formatImpl(localeElements, elseOptions, isoStrInfo, "en-US");
      }
    }
    if (dateOnly) {
      return datePart;
    }
    timePart = _formatImpl(localeElements, timePartOptions, isoStrInfo, "en-US");
    pattern = pattern.replace(/'/g, "");
    pattern = _replaceParams(pattern, [timePart, datePart]);
    return pattern;
  };

  _formatRelativeDisplayName = function (isoNow, isoValue, options, localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var fields = mainNode['dates']['fields'];
    var getOption = OraI18nUtils.getGetOption(options,
        "OraDateTimeConverter.formatRelative");
    var option = getOption('dateField', 'string',
        ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);
    var now = OraI18nUtils.isoToLocalDate(isoNow);
    var value = OraI18nUtils.isoToLocalDate(isoValue);
    switch (option) {
      case "day" :
        if (_isSameDay(now, value))
          return fields['day']['relative-type-0'];
        if (_isNextDay(now, value))
          return fields['day']['relative-type-1'];
        if (_isPrevDay(now, value))
          return fields['day']['relative-type--1'];
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'day');
      case "week" :
        if (_isSameWeek(localeElements, now, value))
          return fields['week']['relative-type-0'];
        if (_isNextWeek(localeElements, now, value))
          return fields['week']['relative-type-1'];
        if (_isPrevWeek(localeElements, now, value))
          return fields['week']['relative-type--1'];
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'week');
      case "month" :
        if (_isSameMonth(now, value))
          return fields['month']['relative-type-0'];
        if (_isNextMonth(now, value))
          return fields['month']['relative-type-1'];
        if (_isPrevMonth(now, value))
          return fields['month']['relative-type--1'];
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'month');
      case "year" :
        if (_isSameYear(now, value))
          return fields['year']['relative-type-0'];
        if (_isNextYear(now, value))
          return fields['year']['relative-type-1'];
        if (_isPrevYear(now, value))
          return fields['year']['relative-type--1'];
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'year');
      case "hour" :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'hour');
      case "minute" :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'minute');
      case "second" :
        return _formatRelativeImplicit(isoNow, isoValue, localeElements, 'second');
      default :
        break;
    }
    return null;
  };

  _daysToMonths = function (days) {
    // 400 years have 146097 days (taking into account leap year rules)
    return days * 4800 / 146097;
  };

  _getUnits = function (milliseconds) {
    var days = milliseconds / 864e5;
    var months = _daysToMonths(days);
    var years = months / 12;
    var obj = {
      'year': Math.round(years),
      'month': Math.round(months),
      'week': Math.round(milliseconds / 6048e5),
      'day': Math.round(milliseconds / 864e5),
      'hour': Math.round(milliseconds / 36e5),
      'minute': Math.round(milliseconds / 6e4),
      'second': Math.round(milliseconds / 1000),
      'millisecond': milliseconds
    };
    return obj;
  };

  //return the language part
  _getBCP47Lang = function (tag) {
    var arr = tag.split("-");
    return arr[0];
  };

  _formatRelativeImplicit = function (now, relativeDate, localeElements, field) {
    var future = "relativeTime-type-future";
    var past = "relativeTime-type-past";
    var nowNodeKey = "relative-type-0";
    var mainNodeKey = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var lang = _getBCP47Lang(mainNodeKey);
    var plurals = localeElements['supplemental']['plurals'];
    var fields = mainNode['dates']['fields'];
    var pluralKey = "relativeTimePattern-count-";

    var diff = _getTimeDiff(relativeDate, now, false);
    var absdiff = Math.abs(diff);
    var units = _getUnits(absdiff);
    if (field === null) {
      field = units['second'] < _THRESHOLDS.s && 'second' ||
          units['minute'] < _THRESHOLDS.m && 'minute' ||
          units['hour'] < _THRESHOLDS.h && 'hour' ||
          units['day'] < _THRESHOLDS.d && 'day' ||
          units['week'] < _THRESHOLDS.w && 'week' ||
          units['month'] < _THRESHOLDS.M && 'month' ||
          'year';
    }
    //when seconds <= 45 display 'now' instead of number of seconds
    if (field === 'second' && units['second'] < _THRESHOLDS.s) {
      return fields[field][nowNodeKey];
    }
    var plural = plurals[lang](units[field]);
    var pluralEntry = pluralKey + plural;
    var x = diff < 0 ? past : future;
    var format = fields[field][x][pluralEntry];
    //some locales only have other plural entry
    if (format === undefined) {
      pluralEntry = pluralKey + 'other';
      format = fields[field][x][pluralEntry];
    }
    format = _replaceParams(format, [units[field]]);
    return format;
  };

  _formatRelativeImpl = function (value, localeElements, options) {
    var now = OraI18nUtils.dateToLocalIso(new Date());
    if (typeof value === "number") {
      value = OraI18nUtils.dateToLocalIso(new Date(value));
    }
    else if (typeof value === "string") {
      if (OraI18nUtils.trim(value) === '')
        return null;
    }
    else {
      return null;
    }
    if (options === undefined) {
      options = {'formatUsing': 'displayName'};
    }
    var getOption = OraI18nUtils.getGetOption(options,
        "OraDateTimeConverter.formatRelative");
    var relativeTime = getOption('relativeTime', 'string',
        ['fromNow', 'toNow'], 'fromNow');
    var fieldOption = getOption('dateField', 'string',
        ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);

    value = _convertToLocalDate(value, localeElements, options);
    var toNow = (relativeTime === 'toNow');
    if (toNow) {
      var tmp = now;
      now = value;
      value = tmp;
    }
    var formatUsing = getOption('formatUsing', 'string',
        ['displayName', 'calendar'], 'displayName');
    if (formatUsing === 'calendar') {
      var dateOnly = getOption('dateOnly', 'boolean', [true, false], false);
      return _formatRelativeCalendar(now, value, localeElements, dateOnly);
    }
    if (fieldOption !== undefined)
      return _formatRelativeDisplayName(now, value, options, localeElements);
    return _formatRelativeImplicit(now, value, localeElements, null);
  };


  // parse functions

  _throwWeekdayMismatch = function (weekday, day) {
    var msg;
    var error;
    var errorInfo;
    msg = "The weekday " + weekday + " does not match the date " + day;
    error = new Error(msg);
    errorInfo = {
      'errorCode': 'dateToWeekdayMismatch',
      'parameterMap': {
        'weekday': weekday,
        'date': day
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  _throwDateFormatMismatch = function (value, format, style) {
    var msg;
    var error;
    var errorInfo;
    var errorCodeType;
    if (style === 2) {
      msg = "The value \"" + value +
          "\" does not match the expected date-time format \"" + format + '"';
      errorCodeType = "datetimeFormatMismatch";
    }
    else if (style === 0) {
      msg = "The value \"" + value +
          "\" does not match the expected date format \"" + format + '"';
      errorCodeType = "dateFormatMismatch";

    }
    else {
      msg = "The value \"" + value +
          "\" does not match the expected time format \"" + format + '"';
      errorCodeType = "timeFormatMismatch";

    }
    error = new Error(msg);
    errorInfo = {
      'errorCode': errorCodeType,
      'parameterMap': {
        'value': value,
        'format': format
      }
    };
    error['errorInfo'] = errorInfo;
    throw error;
  };

  _expandYear = function (start2DigitYear, year) {
    // expands 2-digit year into 4 digits.
    if (year < 100) {
      var ambiguousTwoDigitYear = start2DigitYear % 100;
      year += Math.floor((start2DigitYear / 100)) * 100 +
          (year < ambiguousTwoDigitYear ? 100 : 0);
    }
    return year;
  };

  _arrayIndexOfDay = function (daysObj, item) {
    var days = {
      "sun": 0,
      "mon": 1,
      "tue": 2,
      "wed": 3,
      "thu": 4,
      "fri": 5,
      "sat": 6
    };
    for (var d in daysObj) {
      if (OraI18nUtils.trim(OraI18nUtils.toUpper(daysObj[d])) === OraI18nUtils.trim(item)) {
        return days[d];
      }
    }
    return -1;
  };

  _arrayIndexOfMonth = function (monthsObj, item) {
    for (var m in monthsObj) {
      if (OraI18nUtils.trim(OraI18nUtils.toUpper(monthsObj[m])) === OraI18nUtils.trim(item)) {
        return (m - 1);
      }
    }
    return -1;
  };

  _getDayIndex1 = function (localeElements, value, fmt) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var ret;
    var days;
    var calDaysFmt =
        mainNode['dates']['calendars']['gregorian']['days']['format'];
    var calDaysStdAlone =
        mainNode['dates']['calendars']['gregorian']['days']['stand-alone'];
    switch (fmt) {
      case 0:
        days = [
          calDaysFmt['abbreviated'],
          calDaysFmt['wide']
        ];
        break;
      case 1:
        days = [
          calDaysStdAlone['abbreviated'],
          calDaysStdAlone['wide']
        ];
        break;
      default:
        break;
    }
    value = OraI18nUtils.toUpper(value);
    ret = _arrayIndexOfDay(days[0], value);
    if (ret === -1) {
      ret = _arrayIndexOfDay(days[1], value);
    }
    return ret;
  };

  //fmt:0 for format, 1 for stand-alone, 2 for lenient parse
  _getMonthIndex = function (localeElements, value, fmt) {
    var ret = -1;
    var months;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calMonthsFmt =
        mainNode['dates']['calendars']['gregorian']['months']['format'];
    var calMonthsStdAlone =
        mainNode['dates']['calendars']['gregorian']['months']['stand-alone'];
    switch (fmt) {
      case 0:
        months = [
          calMonthsFmt['wide'],
          calMonthsFmt['abbreviated']
        ];
        break;
      case 1:
        months = [
          calMonthsStdAlone['wide'],
          calMonthsStdAlone['abbreviated']
        ];
        break;
      case 2:
        months = [
          calMonthsFmt['wide'],
          calMonthsFmt['abbreviated'],
          calMonthsStdAlone['wide'],
          calMonthsStdAlone['abbreviated']
        ];
        break;
      default:
        return -1;
    }
    value = OraI18nUtils.toUpper(value);
    for (var m in months) {
      ret = _arrayIndexOfMonth(months[m], value);
      if (ret !== -1) {
        return ret;
      }
    }
    return ret;
  };

  // converts a format string into a regular expression with groups that
  // can be used to extract date fields from a date string.
  // check for a cached parse regex.
  _getParseRegExp = function (format, options) {
    var re = {};


    // expand single digit formats, then escape regular expression
    //  characters.
    var expFormat = format.replace(_ESCAPE_REGEXP, "\\\\$1");
    var regexp = ["^"];
    var groups = [];
    var index = 0;
    var quoteCount = 0;
    var match;

    // iterate through each date token found.
    while ((match = _TOKEN_REGEXP.exec(expFormat)) !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // don't replace any matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2) {
        regexp.push(match[0]);
        continue;
      }

      // add a regex group for the token.
      var m = match[ 0 ];
      var add;
      if (_PROPERTIES_MAP[m] !== undefined) {
        add = _PROPERTIES_MAP[m]['regExp'];
      }
      else
        _throwInvalidDateFormat(format, options, m);
      if (add) {
        regexp.push(add);
      }
      groups.push(match[0]);
    }
    _appendPreOrPostMatch(expFormat.slice(index), regexp);
    regexp.push("$");

    // allow whitespace to differ when matching formats.
    var regexpStr = regexp.join("").replace(/\s+/g, "\\s+");
    var parseRegExp = {
      'regExp': regexpStr,
      'groups': groups
    };
    // cache the regex for this format.
    return re[ format ] = parseRegExp;
  };

  _validateRange = function (name, value, low, high, displayValue,
      displayLow, displayHigh) {
    if (value < low || value > high) {
      var msg = displayValue +
          " is out of range.  Enter a value between " + displayLow +
          " and " + displayHigh + " for " + name;
      var rangeError = new RangeError(msg);
      var errorInfo = {
        'errorCode': "datetimeOutOfRange",
        'parameterMap': {
          'value': displayValue,
          'minValue': displayLow,
          'maxValue': displayHigh,
          'propertyName': name
        }
      };
      rangeError['errorInfo'] = errorInfo;
      throw rangeError;
    }
  };

  _getTokenIndex = function (arr, token) {
    for (var i = 0; i < arr.length; i++) {
      for (var n in arr[i])
      {
        if (n === token)
          return parseInt(i, 10);
      }
    }
    return 0;
  };

  //time lenient parse
  _parseLenienthms = function (result, timepart, format, localeElements, dtype) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calPM = mainNode['dates']['calendars']['gregorian']['dayPeriods']['format']['wide']['pm'];
    //hour, optional minutes and optional seconds
    _TIME_REGEXP.lastIndex = 0;
    var hour = 0, minute = 0, second = 0, msec = 0, idx;
    var match = _TIME_REGEXP.exec(timepart);
    if (match === null) {
      _throwDateFormatMismatch(timepart, format, dtype);
    }
    if (match[1] !== undefined)
      hour = parseInt(match[1], 10);
    if (match[2] !== undefined)
      minute = parseInt(match[2], 10);
    if (match[3] !== undefined)
      second = parseInt(match[3], 10);
    if (match[4] !== undefined)
      msec = parseInt(match[4], 10);

    _TIME_FORMAT_REGEXP.lastIndex = 0;
    match = _TIME_FORMAT_REGEXP.exec(format);
    switch (match[0]) {
      case "h":
        // Hour in am/pm (1-12)
        if (hour === 12)
          hour = 0;
        _validateRange("hour", hour, 0, 11, hour, 1, 12);
        idx = (OraI18nUtils.toUpper(timepart)).indexOf(OraI18nUtils.toUpper(calPM));
        if (idx !== -1 && hour < 12)
          hour += 12;
        break;
      case "K":
        // Hour in am/pm (0-11)
        _validateRange("hour", hour, 0, 11, hour, 0, 11);
        idx = (OraI18nUtils.toUpper(timepart)).indexOf(OraI18nUtils.toUpper(calPM));
        if (idx !== -1 && hour < 12)
          hour += 12;
        break;
      case "H":
        _validateRange("hour", hour, 0, 23, hour, 0, 23);
        break;
      case "k":
        if (hour === 24)
          hour = 0;
        _validateRange("hour", hour, 0, 23, hour, 1, 24);
        break;
      default:
        break;
    }
    // Minutes.
    _validateRange("minute", minute, 0, 59, minute, 0, 59);
    // Seconds.
    _validateRange("second", second, 0, 59, second, 0, 59);
    //millisec
    _validateRange("millisec", msec, 0, 999, msec, 0, 999);

    result.setHours(hour, minute, second, msec);
  };

  _getWeekdayName = function (value, localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var calDaysFmt =
        mainNode['dates']['calendars']['gregorian']['days']['format'];
    var calDaysStandAlone =
        mainNode['dates']['calendars']['gregorian']['days']['stand-alone'];
    var days = [
      calDaysFmt['wide'],
      calDaysFmt['abbreviated'],
      calDaysStandAlone['wide'],
      calDaysStandAlone['abbreviated']
    ];

    var foundMatch = false;
    var dName, i, j;
    for (i in days) {
      for (j in days[i]) {
        dName = days[i][j];
        var dRegExp = new RegExp(dName + "\\b", 'i');
        if (dRegExp.test(value)) {
          foundMatch = true;
          break;
        }
      }
      if (foundMatch)
        break;
      dName = null;
    }
    return dName;
  };

  //lenient parse yMd and yMEd patterm. Must have year, moth, 
  //date all numbers. Ex: 5/3/2013
  //weekday is optional. If present it must match date. 
  //Ex:  Tuesday 11/19/2013
  //if year is 3-digits it can be anywhere in the string. 
  //Otherwise assume its position based on pattern
  //if date > 12 it can be anywhere in the string. 
  //Otherwise assume its position based on pattern 
  //separators can be any non digit characters
  _parseLenientyMEd = function (value, format, options, localeElements,
      isDateTime)
  {
    _YMD_REGEXP.lastIndex = 0;
    var match = _YMD_REGEXP.exec(value);
    if (match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(value, format, dtype);
    }
    var tokenIndexes = [{
        'y': format.indexOf("y")
      }, {
        'M': format.indexOf("M")
      }, {
        'd': format.indexOf("d")
      }];
    tokenIndexes.sort(function (a, b) {
      for (var n1 in a)
      {
        break;
      }
      for (var n2 in b)
      {
        break;
      }
      return a[n1] - b[n2];
    });
    var year, month, day, yearIndex, foundDayIndex, i, j;
    var dayIndex = _getTokenIndex(tokenIndexes, 'd');
    var foundYear = false, foundDay = false;
    for (i = 1; i <= 3; i++)
    {
      var tokenMatch = match[i];
      //find year if year is yyy|yyyy
      if (tokenMatch.length > 2 || tokenMatch > 31)
      {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i - 1;
      }
    }
    if (!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    }
    //find day if day value > 12
    for (i = 0; i < 3; i++) {
      if (i !== yearIndex && match[i + 1] > 12) {
        day = match[i + 1];
        foundDay = true;
        foundDayIndex = i;
        break;
      }
    }
    if (!foundDay) {
      if (yearIndex === _getTokenIndex(tokenIndexes, 'd'))
      {
        day = match[_getTokenIndex(tokenIndexes, 'y') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];
      }
      else if (yearIndex === _getTokenIndex(tokenIndexes, 'M'))
      {
        day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'y') + 1];
      }
      else {
        day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];

      }
    }
    else {
      for (i = 0; i < 3; i++) {
        if (i !== foundDayIndex && i !== yearIndex) {
          month = match[i + 1];
          break;
        }
      }
      if (month === undefined) {
        month = match[_getTokenIndex(tokenIndexes, 'M') + 1];
      }
    }
    month -= 1;
    var daysInMonth = _getDaysInMonth(year, month);
    //if both month and day > 12 and swapped, throw exception
    // based on original order
    if (foundDay && dayIndex !== foundDayIndex && month > 12) {
      _validateRange("month", day, 0, 11, day, 1, 12);
    }
    _validateRange("month", month, 0, 11, month + 1, 1, 12);
    _validateRange("day", day, 1, daysInMonth, day, 1, daysInMonth);
    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange("year", year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    //locate weekday
    var dName = _getWeekdayName(value, localeElements);
    if (dName !== null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var result =
        {
          'value': parsedDate,
          'offset': '',
          'warning': 'lenient parsing was used'
        };
    if (isDateTime) {
      var timepart = value.substr(_YMD_REGEXP.lastIndex);
      if (timepart.length === 0)
        result['value'].setHours(0, 0, 0, 0);
      else
        _parseLenienthms(result['value'], timepart, format, localeElements, 2);
    }
    result['value'] = OraI18nUtils.dateToLocalIso(result['value']);
    return result;
  };

  //lenient parse yMMMd and yMMMEd patterns. Must have year, date as numbers 
  //and month name.
  //weekday is optional. If present it must match date.
  // Ex:  Monday Nov, 11 2013
  //weekday and month name can be anywhere in the string.
  //if year > 2-digits it can be anywhere in the string. 
  //Otherwise assume its position based on pattern
  //separators can be any non digit characters
  _parseLenientyMMMEd = function (value, format, options, localeElements,
      isDateTime) {
    var origValue = value;
    value = OraI18nUtils.toUpper(value);
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    //locate month name
    var calMonthsFmt =
        mainNode['dates']['calendars']['gregorian']['months']['format'];
    var calMonthsStandAlone =
        mainNode['dates']['calendars']['gregorian']['months']['stand-alone'];
    var months = [
      calMonthsFmt['wide'],
      calMonthsFmt['abbreviated'],
      calMonthsStandAlone['wide'],
      calMonthsStandAlone['abbreviated']
    ];
    var foundMatch = false;
    var reverseMonth;
    var i, j, mName;
    for (i in months) {
      reverseMonth = [];
      for (j in months[i]) {
        mName = OraI18nUtils.toUpper(months[i][j]);
        reverseMonth.push({
          'idx': j,
          'name': mName
        });
      }
      reverseMonth.sort(function (a, b) {
        return b['idx'] - a['idx'];
      });

      for (j in reverseMonth) {
        mName = reverseMonth[j]['name'];
        if (value.indexOf(mName) !== -1) {
          foundMatch = true;
          value = value.replace(mName, "");
          break;
        }
      }
      if (foundMatch)
        break;
    }
    //There is no month name. Try yMEd lenient parse.
    if (!foundMatch) {
      return _parseLenientyMEd(origValue, format, options, localeElements,
          isDateTime);
    }

    var month = _getMonthIndex(localeElements, mName, 2);
    _validateRange("month", month, 0, 11, month, 1, 12);

    //locate weekday
    var dName = _getWeekdayName(origValue, localeElements);
    var dRegExp = new RegExp(dName + "\\W", 'i');
    if (dName !== null) {
      value = value.replace(dRegExp, "");
    }
    //find year and date
    _YEAR_AND_DATE_REGEXP.lastIndex = 0;
    var match = _YEAR_AND_DATE_REGEXP.exec(value);
    if (match === null) {
      var dtype = isDateTime ? 2 : 0;
      _throwDateFormatMismatch(origValue, format, dtype);
    }
    var tokenIndexes = [{
        'y': format.indexOf("y")
      }, {
        'd': format.indexOf("d")
      }];

    tokenIndexes.sort(function (a, b) {
      for (var n1 in a)
      {
        break;
      }
      for (var n2 in b)
      {
        break;
      }
      return a[n1] - b[n2];
    });

    var year, day, yearIndex;
    var foundYear = false;
    for (i = 1; i <= 2; i++)
    {
      var tokenMatch = match[i];
      //find year if year is yyy|yyyy
      if (tokenMatch.length > 2 || tokenMatch > 31)
      {
        year = tokenMatch;
        foundYear = true;
        yearIndex = i - 1;
      }
    }
    if (!foundYear) {
      yearIndex = _getTokenIndex(tokenIndexes, 'y');
      year = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    }
    if (yearIndex === _getTokenIndex(tokenIndexes, 'd'))
    {
      day = match[_getTokenIndex(tokenIndexes, 'y') + 1];
    }
    else {
      day = match[_getTokenIndex(tokenIndexes, 'd') + 1];
    }

    var start2DigitYear = _get2DigitYearStart(options);
    year = _expandYear(start2DigitYear, parseInt(year, 10));
    _validateRange("year", year, 0, 9999, year, 0, 9999);
    var parsedDate = new Date(year, month, day);
    if (dName !== null) {
      var weekDay = _getDayIndex1(localeElements, dName, 0);
      // day of week does not match date
      if (parsedDate.getDay() !== weekDay) {
        _throwWeekdayMismatch(dName, parsedDate.getDate());
      }
    }
    var daysInMonth = _getDaysInMonth(year, month);
    _validateRange("day", day, 1, daysInMonth, day, 1, daysInMonth);
    var result =
        {
          'value': parsedDate,
          'offset': '',
          'warning': 'lenient parsing was used'
        };
    if (isDateTime) {
      var timepart = value.substr(_YEAR_AND_DATE_REGEXP.lastIndex);
      if (timepart.length === 0)
        result['value'].setHours(0, 0, 0, 0);
      else
        _parseLenienthms(result['value'], timepart, format, localeElements, 2);
    }
    result['value'] = OraI18nUtils.dateToLocalIso(result['value']);
    return result;
  };

  _parseLenient = function (value, format, options, localeElements) {
    var dtStyle = _dateTimeStyle(options, "OraDateTimeConverter.parse");
    switch (dtStyle) {
      //date style
      case 0 :
        return _parseLenientyMMMEd(value, format, options, localeElements,
            false);
        break
        //time style
      case 1 :
        var d = new Date();
        _parseLenienthms(d, value, format, localeElements, 1);
        var isoStr = OraI18nUtils.dateToLocalIso(d);
        var result =
            {
              'value': isoStr,
              'offset': '',
              'warning': 'lenient parsing was used'
            };
        return result;
        break;
        //date-time style
      case 2 :
        return _parseLenientyMMMEd(value, format, options, localeElements,
            true);
        break;
      default:
        break;
    }
    return null;
  };

  _getNameIndex = function (localeElements, datePart, matchGroup, mLength,
      style, matchIndex, start1, end1, start2, end2, name) {
    var index;
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var monthsFormat =
        mainNode['dates']['calendars']['gregorian'][datePart][style];
    var startName;
    var endName;
    if (datePart === 'months') {
      index = _getMonthIndex(localeElements, matchGroup, matchIndex);
    }
    else {
      index = _getDayIndex1(localeElements, matchGroup, matchIndex);
    }
    startName = monthsFormat[mLength][start2];
    endName = monthsFormat[mLength][end2];
    _validateRange(name, index, start1, end1, matchGroup,
        startName, endName);
    return index;
  };

  _getTimePart = function (matchInt, timeObj, objMap, timeToken) {
    timeObj[objMap['timePart']] = matchInt;
    if (timeToken === 'h' || timeToken === 'hh') {
      if (matchInt === 12)
        timeObj[objMap['timePart']] = 0;
    }
    else if (timeToken === 'k' || timeToken === 'kk') {
      if (matchInt === 24)
        timeObj[objMap['timePart']] = 0;
    }
    _validateRange(objMap['timePart'], timeObj[objMap['timePart']],
        objMap['start1'], objMap['end1'], matchInt,
        objMap['start2'], objMap['end2']);
  };

  //exact match parsing for date-time. If it fails, try lenient parse.
  _parseExact = function (value, format, options, localeElements) {
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    // remove spaces from era.
    var cal = mainNode['dates']['calendars']['gregorian'];
    var eraPart = cal['eras']['eraAbbr']['1'];
    var trimEraPart = OraI18nUtils.trimNumber(eraPart);
    value = value.replace(eraPart, trimEraPart);

    // convert date formats into regular expressions with groupings.
    // use the regexp to determine the input format and extract the date
    //  fields.
    var parseInfo = _getParseRegExp(format, options),
        match = new RegExp(parseInfo['regExp']).exec(value);
    if (match === null) {
      return _parseLenient(value, format, options, localeElements);
    }
    // found a date format that matches the input.
    var groups = parseInfo['groups'],
        year = null, month = null, date = null, weekDay = null,
        hourOffset = "", tzID = null,
        pmHour = false, weekDayName,
        timeObj = {
          'hour': 0,
          'minute': 0,
          'second': 0,
          'millisec': 0
        },
        calPM = mainNode['dates']['calendars']['gregorian']['dayPeriods']['format']['wide']['pm'];
    var start2DigitYear = _get2DigitYearStart(options);
    // iterate the format groups to extract and set the date fields.
    for (var j = 0, jl = groups.length; j < jl; j++) {
      var matchGroup = match[ j + 1 ];
      if (matchGroup) {
        var current = groups[ j ],
            matchInt = parseInt(matchGroup, 10),
            currentGroup = _PROPERTIES_MAP[current];
        switch (currentGroup['token']) {
          case 'months':
            month = _getNameIndex(localeElements, currentGroup['token'],
                matchGroup, currentGroup['mLen'], currentGroup['style'],
                currentGroup['matchIndex'], 0, 11, '1', '12', 'month name');
            break;
          case 'days':
            weekDayName = matchGroup;
            weekDay = _getNameIndex(localeElements, currentGroup['token'],
                matchGroup, currentGroup['dLen'], currentGroup['style'],
                currentGroup['matchIndex'], 0, 6, 'sun', 'sat', 'weekday');
            break;
          case 'time':
            _getTimePart(matchInt, timeObj, currentGroup, current);
            break;
          case 'dayOfMonth':
            date = matchInt;
            //try leneient parse for date style only
            if (date > 31)
              return _parseLenient(value, format, options, localeElements);
            break;
          case 'monthIndex':
            // Month.
            month = matchInt - 1;
            //try leneient parse for date style only
            if (month > 11)
              return _parseLenient(value, format, options, localeElements);
            break;
          case 'year':
            year = _expandYear(start2DigitYear, matchInt);
            _validateRange("year", year, 0, 9999, year, 0, 9999);
            break;
          case "ampm":
            pmHour = (OraI18nUtils.toUpper(matchGroup)).indexOf(OraI18nUtils.toUpper(calPM)) !== -1;
            break;
          case "tzhm":
            // Time zone hours minutes: -0800 
            hourOffset = matchGroup.substr(-2);
            hourOffset = matchGroup.substr(0, 3) + ":" + hourOffset;
            break;
          case "tzhsepm":
            // Time zone hours minutes: -08:00 
            hourOffset = matchGroup;
            break;
          case "tzh":
            // Time zone hours minutes: -08 
            hourOffset = matchGroup + ":00";
            break;
          case "tzid":
            // Time zone ID: America/Los_Angeles 
            tzID = matchGroup;
            break;
        }
      }
    }
    var parsedDate = new Date();
    if (year === null) {
      year = parsedDate.getFullYear();
    }
    // if day and month are unspecified,the defaults are current 
    // day and month.
    if (month === null && date === null) {
      month = parsedDate.getMonth();
      date = parsedDate.getDate();
    }
    // if day is unspecified, default 1st day of month.
    else if (date === null) {
      date = 1;
    }

    //validate day range, depending on the month and year
    var daysInMonth = _getDaysInMonth(year, month);
    _validateRange("day", date, 1, daysInMonth, date, 1, daysInMonth);
    parsedDate.setFullYear(year, month, date);

    // day of week does not match date
    if (weekDay !== null && parsedDate.getDay() !== weekDay) {
      _throwWeekdayMismatch(weekDayName, parsedDate.getDate());
    }
    // if pm designator token was found make sure the hours fit the 
    // 24-hour clock.
    if (pmHour && timeObj['hour'] < 12) {
      timeObj['hour'] += 12;
    }
    var parts = [year, month + 1, date, timeObj['hour'], timeObj['minute'],
      timeObj['second'], timeObj['millisec']];
    var isoParsedDate = OraI18nUtils.partsToIsoString(parts);
    if (tzID !== null) {
      var zone = _getTimeZone(tzID, localeElements);
      var index = _parseZone(zone, parts, false, true, true);
      hourOffset = -zone.ofset(index);
      hourOffset = OraI18nUtils.getTimeStringFromOffset("", hourOffset, false, true)
    }
    if (hourOffset !== "") {
      isoParsedDate += hourOffset;
    }
    var result =
        {
          'value': isoParsedDate
        };
    return result;
  };

  //given a user defined pattern, derive the ecma options that will
  //be returned by getResolvedOptions method
  _getResolvedOptionsFromPattern = function (locale, numberingSystemKey,
      pattern) {
    // expand single digit formats, then escape regular expression 
    // characters.
    var expFormat = pattern.replace(_ESCAPE_REGEXP, "\\\\$1");
    var regexp = ["^"];
    var quoteCount = 0;
    var index = 0;
    var match;
    var result = {
      'locale': locale,
      'numberingSystem': numberingSystemKey,
      'calendar': 'gregorian'
    };
    // iterate through each date token found.
    while ((match = _TOKEN_REGEXP.exec(expFormat)) !== null) {
      var preMatch = expFormat.slice(index, match.index);
      index = _TOKEN_REGEXP.lastIndex;

      // skip matches that occur inside a string literal.
      quoteCount += _appendPreOrPostMatch(preMatch, regexp);
      if (quoteCount % 2) {
        continue;
      }

      // add a regex group for the token.
      var m = match[ 0 ];
      if (m === '/' || m === 'zzzz' || m === 'zzz' || m === 'zz' || m === 'z') {
        continue;
      }
      if (_PROPERTIES_MAP[m] !== undefined) {
        if (_PROPERTIES_MAP[m]['key'] !== undefined)
          result[_PROPERTIES_MAP[m]['key']] = _PROPERTIES_MAP[m]['value'];
        if (m === 'kk' || m === 'HH' || m === 'H' || m === 'k') {
          result['hour12'] = false;
        }
        else if (m === 'KK' || m === 'hh' || m === 'h' || m === 'K') {
          result['hour12'] = true;
        }
      }
      else {
        _throwInvalidDateFormat(pattern, result, m);
      }
    }
    return result;
  };
  //test if the pattern is date, time or date-time
  //0: date, 1:time, 2:date-time
  _dateTimeStyleFromPattern = function (pattern) {
    var result = _getResolvedOptionsFromPattern('', '', pattern);
    var isDate = (result['year'] !== undefined || result['month'] !==
        undefined ||
        result['weekday'] !== undefined || result['day'] !== undefined);
    var isTime = (result['hour'] !== undefined || result['minute'] !==
        undefined || result['second'] !== undefined ||
        result['millisecond'] !== undefined);
    if (isDate && isTime)
      return 2;
    else if (isTime)
      return 1;
    else
      return 0;
  };

  //test if the isoStr is date, time or date-time
  //0: date, 1:time, 2:date-time
  _isoStrDateTimeStyle = function (isoStr) {
    var timeIndex = isoStr.indexOf("T");
    if (timeIndex === -1)
      return 0;
    if (timeIndex > 0)
      return 2;
    return 1;
  };

  //test if the pattern/options is date, time or date-time
  //0: date, 1:time, 2:date-time
  _dateTimeStyle = function (options, caller) {
    //try pattern
    if (options['pattern'] !== undefined) {
      return _dateTimeStyleFromPattern(options['pattern']);
    }

    //try ecma options
    var getOption = OraI18nUtils.getGetOption(options, caller);
    var isTime = (getOption('hour', 'string', ['2-digit', 'numeric']) !==
        undefined ||
        getOption('minute', 'string', ['2-digit', 'numeric']) !== undefined ||
        getOption('second', 'string', ['2-digit', 'numeric']) !== undefined ||
        getOption('millisecond', 'string', ['numeric']) !== undefined);
    var isDate = (getOption('year', 'string', ['2-digit', 'numeric']) !==
        undefined ||
        getOption('month', 'string',
            ['2-digit', 'numeric', 'narrow', 'short', 'long']) !== undefined ||
        getOption('day', 'string', ['2-digit', 'numeric']) !== undefined ||
        getOption('weekday', 'string', ['narrow', 'short', 'long']) !==
        undefined);
    if (isDate && isTime)
      return 2;
    else if (isTime)
      return 1;
    else if (isDate)
      return 0;

    //try predefined style
    var option = getOption('formatType', 'string',
        ['date', 'time', 'datetime'], 'date');
    if (option === 'datetime')
      return 2;
    else if (option === 'time')
      return 1;
    return 0;
  };

  _getStdOffset = function (zone, value) {
    var index = _parseZone(zone, value, false, true, false);
    var offset0 = zone.ofset(index);
    var offset1 = zone.ofset(index + 1);
    return Math.max(offset0, offset1);
  };

  _adjustHours = function (isoStrInfo, options, localeElements) {
    var value = isoStrInfo['isoStrParts'];
    var isoStrFormat = isoStrInfo['format'];
    var timeZone = options['timeZone'];
    var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter.parse");
    var zone = _getTimeZone(timeZone, localeElements);
    var utcd;
    var origOffset;
    var newOffset;
    var index;
    utcd = Date.UTC(value[0], value[1] - 1, value[2],
        value[3], value[4], value[5]);
    switch (isoStrFormat) {
      case _OFFSET :
        var tzPart = isoStrInfo['timeZone'];
        origOffset = tzPart.split(":");
        var hoursOffset = parseInt(origOffset[0], 10);
        var minOffset = parseInt(origOffset[1], 10);
        origOffset = (hoursOffset * 60) +
            (OraI18nUtils.startsWith(tzPart, "-") ? -minOffset : minOffset);
        break;
      case _ZULU :
        origOffset = 0;
        break;
      default :
        break;
    }
    //get target zone offset:
    //1.get target zone standard time offset
    newOffset = _getStdOffset(zone, value);
    //2.adjust utcd to target zone
    utcd -= (newOffset + origOffset) * 60000;
    //3.get target zone offset
    index = zone.parse(utcd, false, true, false);
    newOffset = -zone.ofset(index);
    //adjust the offset
    newOffset -= origOffset;
    //Do the offset math through the Date object.
    var adjustD = new Date(Date.UTC(value[0], value[1] - 1, value[2],
        value[3], value[4], value[5]));

    var adjustedMin = adjustD.getUTCMinutes() + newOffset;
    adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0),
        adjustedMin % 60);
    value[0] = adjustD.getUTCFullYear();
    value[1] = adjustD.getUTCMonth() + 1;
    value[2] = adjustD.getUTCDate();
    value[3] = adjustD.getUTCHours();
    value[4] = adjustD.getUTCMinutes();
    value[5] = adjustD.getUTCSeconds();

  };

  //test if isoStrInfo is date, time or date-time
  //0: date, 1:time, 2:date-time
  _getIsoStrStyle = function (isoStrInfo) {
    var dt = isoStrInfo['dateTime'];
    var dtStyle = 2;
    var dtParts = dt.split('T');
    //time only Thh:mm:ss
    if (dtParts[0] === "")
      dtStyle = 1;
    //date only yy-MM-dd
    else if (dtParts[1] === undefined)
      dtStyle = 0;
    //date-time    
    return dtStyle;
  };

  //Returns a time-only, date-only or date-time ISO string based on dtStyle.
  _createISOStrParts = function (dtStyle, d) {
    var ms;
    var val = "";
    switch (dtStyle) {
      //Date only
      case 0 :
        val = OraI18nUtils.padZeros(d[0], 4) + "-" + OraI18nUtils.padZeros(d[1], 2) + "-" +
            OraI18nUtils.padZeros(d[2], 2);
        break;
        //Time only
      case 1 :
        val = "T" + OraI18nUtils.padZeros(d[3], 2) + ":" +
            OraI18nUtils.padZeros(d[4], 2) + ":" +
            OraI18nUtils.padZeros(d[5], 2);
        ms = d[6];
        if (ms > 0) {
          val += "." + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(ms, 3));
          ;
        }
        break;
        //Date-Time  
      default :
        val = OraI18nUtils.padZeros(d[0], 4) + "-" +
            OraI18nUtils.padZeros(d[1], 2) + "-" +
            OraI18nUtils.padZeros(d[2], 2) +
            "T" + OraI18nUtils.padZeros(d[3], 2) + ":" +
            OraI18nUtils.padZeros(d[4], 2) + ":" +
            OraI18nUtils.padZeros(d[5], 2);
        ms = d[6];
        if (ms > 0) {
          val += "." + OraI18nUtils.trimRightZeros(OraI18nUtils.padZeros(ms, 3));
        }
        break;
    }
    return val;
  };

  _getParseISOStringOffset = function (tzName, parts, dst, ignoreDst, localeElements, thowException) {
    var zone = _getTimeZone(tzName, localeElements);
    var index = _parseZone(zone, parts, dst, ignoreDst, thowException);
    //hours
    var offset = zone.ofset(index);
    return OraI18nUtils.getTimeStringFromOffset('', offset, true, true);
  };

  _createParseISOStringFromDate = function (dtStyle, isoStrInfo, options, localeElements) {
    var zone;
    var index;
    var offset;
    var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter.parse");
    var isoFormat = getOption('isoStrFormat', 'string',
        [_ZULU, _OFFSET, _INVARIANT, _LOCAL, _AUTO], _AUTO);
    var dst = getOption('dst', 'boolean', [true, false], false);
    var ignoreDst = true;
    var parts = isoStrInfo['isoStrParts'];
    var dTimeZone = isoStrInfo['timeZone'];
    var tzName = options['timeZone'];
    var isoStrFormat = isoStrInfo['format'];
    var optionsFormat = options['isoStrFormat'];
    var val = _createISOStrParts(dtStyle, parts);
    //do not include timezone if date-only or local
    if (dtStyle === 0 || optionsFormat === 'local') {
      return val;
    }
    //when iso string is time-only, do not ignore dst outside ambiguous intervals.
    if (dtStyle === 1) {
      ignoreDst = false;
    }
    switch (isoFormat) {
      case _OFFSET :
        if (tzName === undefined && isoStrFormat === _OFFSET) {
          val += dTimeZone;
        }
        else if (tzName === undefined && isoStrFormat === _LOCAL) {
          val += "";
        }
        else if (tzName === undefined && isoStrFormat === _ZULU) {
          val += "+00:00";
        }
        else if (tzName !== undefined) {
          offset = _getParseISOStringOffset(tzName, parts, dst, ignoreDst, localeElements, true);
          val += offset;
        }
        break;
      case _ZULU :
        var adjustedMin = 0;
        if (tzName === undefined) {
          if (isoStrFormat === _OFFSET) {
            offset = dTimeZone.split(":");
            var offsetHours = parseInt(offset[0], 10);
            var offsetMinutes = parseInt(offset[1], 10);
            adjustedMin = (offsetHours * 60) +
                (OraI18nUtils.startsWith(offset[0], "-") ? -offsetMinutes : offsetMinutes);
            adjustedMin = -adjustedMin;
          }
        }
        else {
          zone = _getTimeZone(tzName, localeElements);
          index = _parseZone(zone, parts, dst, ignoreDst, true);
          offset = zone.ofset(index);
          adjustedMin = offset;
        }
        if (adjustedMin !== 0) {
          //Do the offset math through date object.
          var adjustD = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2],
              parts[3], parts[4], parts[5], parts[6]));
          adjustedMin = adjustD.getUTCMinutes() + adjustedMin;
          adjustD.setUTCHours(adjustD.getUTCHours() + ((adjustedMin / 60) << 0),
              adjustedMin % 60);
          parts[0] = adjustD.getUTCFullYear();
          parts[1] = adjustD.getUTCMonth() + 1;
          parts[2] = adjustD.getUTCDate();
          parts[3] = adjustD.getUTCHours();
          parts[4] = adjustD.getUTCMinutes();
          parts[5] = adjustD.getUTCSeconds();
          val = _createISOStrParts(dtStyle, parts);
        }
        val += "Z";
        break;
      case _AUTO :
        if (tzName !== undefined) {
          offset = _getParseISOStringOffset(tzName, parts, dst, ignoreDst, localeElements, true);
          val += offset;
        }
        else {
          offset = dTimeZone;
          if (offset)
            val += offset;
        }
        break;
      default :
        break;
    }
    return val;
  };

  _parseImpl = function (str, localeElements, options, locale) {
    var numberingSystemKey = OraI18nUtils.getNumberingExtension(locale);
    if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
      numberingSystemKey = 'latn';
    if (numberingSystemKey !== 'latn') {
      var idx;
      var latnStr = [];
      for (idx = 0; idx < str.length; idx++)
      {
        var pos = OraI18nUtils.numeringSystems[numberingSystemKey].indexOf(str[idx]);
        if (pos !== -1)
          latnStr.push(pos);
        else
          latnStr.push(str[idx]);
      }
      str = latnStr.join("");
    }
    if (arguments.length <= 2 || options === undefined) {
      //default is yMd
      options = {
        'year': 'numeric',
        'month': 'numeric',
        'day': 'numeric'
      };
    }
    var dtStyle;
    var formats;
    //First try if str is an iso 8601 string 
    var testIsoStr = OraI18nUtils._ISO_DATE_REGEXP.test(str);
    var parsedIsoStr;
    var isoStrInfo;
    var res = {};
    if (testIsoStr === true) {
      parsedIsoStr = str;
      dtStyle = _isoStrDateTimeStyle(str);
    }
    else {
      formats = options['pattern'] || _expandFormat(options, localeElements,
          locale, "OraDateTimeConverter.parse");
      dtStyle = _dateTimeStyle(options, "OraDateTimeConverter.parse");
      res = _parseExact(str, formats, options, localeElements);
      parsedIsoStr = res['value'];
    }
    isoStrInfo = OraI18nUtils.getISOStrFormatInfo(parsedIsoStr);
    if (options['timeZone'] !== undefined && isoStrInfo['format'] !== _LOCAL) {
      _adjustHours(isoStrInfo, options, localeElements);
    }
    parsedIsoStr = _createParseISOStringFromDate(dtStyle, isoStrInfo, options, localeElements);
    res['value'] = parsedIsoStr;
    return res;
  };

  //If one of the iso strings is local/invariant parse both strings as local.
  //Else, normalize both strings to zulu
  _getCompareISODatesOptions = function (isoStr1, isoStr2) {
    var options = {'isoStrFormat': _LOCAL};
    var isoInfo1 = OraI18nUtils.getISOStrFormatInfo(isoStr1);
    var isoInfo2 = OraI18nUtils.getISOStrFormatInfo(isoStr2);
    var isoInfo1Format = isoInfo1['format'];
    var isoInfo2Format = isoInfo2['format'];
    if (isoInfo1Format === _LOCAL || isoInfo2Format === _LOCAL) {
      return options;
    }
    options['isoStrFormat'] = _ZULU;
    return options;
  };

  _getPatternResolvedOptions = function (isoFormat, tz, dst, locale,
      numberingSystemKey, options) {
    var result = _getResolvedOptionsFromPattern(locale, numberingSystemKey,
        options['pattern']);
    result['pattern'] = options['pattern'];
    if (isoFormat !== undefined)
      result['isoStrFormat'] = isoFormat;
    if (tz !== undefined)
      result['timeZone'] = tz;
    if (dst !== undefined)
      result['dst'] = dst;
    result['two-digit-year-start'] = _get2DigitYearStart(options);
    return result;
  };

  _getECMAResolvedOptions = function (getOption, result, dst, localeElements) {
    var ecma = false;
    var option;
    if (dst !== undefined)
      result['dst'] = dst;
    option = getOption('year', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result['year'] = option;
      ecma = true;
    }
    option = getOption('era', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      result['era'] = option;
      ecma = true;
    }
    option = getOption('month', 'string', ['2-digit', 'numeric',
      'narrow', 'short', 'long']);
    if (option !== undefined) {
      result['month'] = option;
      ecma = true;
    }
    option = getOption('day', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result['day'] = option;
      ecma = true;
    }
    option = getOption('weekday', 'string', ['narrow', 'short', 'long']);
    if (option !== undefined) {
      result['weekday'] = option;
      ecma = true;
    }
    option = getOption('hour', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result['hour'] = option;
      ecma = true;
      option = getOption('hour12', 'boolean', [true, false]);
      if (option === undefined)
        option = _isHour12(localeElements);
      result['hour12'] = option;
    }
    option = getOption('minute', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result['minute'] = option;
      ecma = true;
    }
    option = getOption('second', 'string', ['2-digit', 'numeric']);
    if (option !== undefined) {
      result['second'] = option;
      ecma = true;
    }
    option = getOption('millisecond', 'string', ['numeric']);
    if (option !== undefined) {
      result['millisecond'] = option;
      ecma = true;
    }
    return ecma;
  };

  _getPredefinedStylesResolvedOptions = function (result, options, localeElements, getOption) {
    var format = _expandPredefinedStylesFormat(options,
        localeElements, OraDateTimeConverter.resolvedOptions);
    var fmtType = getOption('formatType', 'string',
        ['date', 'time', 'datetime'], 'date');
    var dStyle = getOption('dateFormat', 'string',
        ['short', 'medium', 'long', 'full'], 'short');
    var tStyle = getOption('timeFormat', 'string',
        ['short', 'medium', 'long', 'full'], 'short');
    result['formatType'] = fmtType;
    if (fmtType === 'datetime' || fmtType === 'date') {
      result['dateFormat'] = dStyle;
    }
    if (fmtType === 'datetime' || fmtType === 'time') {
      result['timeFormat'] = tStyle;
    }
    result['patternFromOptions'] = format;
  };

  _getRelativeTimeResolvedOptions = function (getOption, result) {
    var option = getOption('formatUsing', 'string', ['displayName', 'calendar']);
    if (option !== undefined) {
      result['formatUsing'] = option;
    }
    option = getOption('dateField', 'string',
        ['day', 'week', 'month', 'year', 'hour', 'minute', 'second']);
    if (option !== undefined) {
      result['dateField'] = option;
    }
    option = getOption('relativeTime', 'string',
        ['fromNow', 'toNow']);
    if (option !== undefined) {
      result['relativeTime'] = option;
    }
    option = getOption('dateOnly', 'boolean', [true, false]);
    if (option !== undefined) {
      result['dateOnly'] = option;
    }
  };

  _getResolvedOptions = function (options, getOption, tz, dst, isoFormat,
      localeElements, numberingSystemKey, locale) {
    var result = {
      'locale': locale,
      'numberingSystem': numberingSystemKey,
      'calendar': 'gregorian'
    };
    var option;
    var count = 0;
    for (option in options) {
      count++;
    }
    if (count === 0) {
      result['year'] = 'numeric';
      result['month'] = 'numeric';
      result['day'] = 'numeric';
      return result;
    }
    if (tz !== undefined) {
      result['timeZone'] = tz;
      if (isoFormat !== undefined)
        result['isoStrFormat'] = isoFormat;
    }

    _getRelativeTimeResolvedOptions(getOption, result);

    var ecma = _getECMAResolvedOptions(getOption, result, dst, localeElements);
    result['two-digit-year-start'] = _get2DigitYearStart(options);
    if (!ecma) {
      _getPredefinedStylesResolvedOptions(result, options, localeElements, getOption);
      return result;
    }
    if (tz !== undefined) {
      option = getOption('timeZoneName', 'string', ['short', 'long']);
      if (option !== undefined) {
        result['timeZoneName'] = option;
      }
    }
    result['patternFromOptions'] = _expandFormat(result,
        localeElements, locale, "OraDateTimeConverter.resolvedOptions");
    return result;
  };

  _getResolvedDefaultOptions = function (localeElements, locale, numberingSystemKey) {
    var defaultOptions = {
      'year': 'numeric',
      'month': 'numeric',
      'day': 'numeric'
    };
    var patternFromOptions = _expandFormat(defaultOptions,
        localeElements, locale, "OraDateTimeConverter.resolvedOptions");
    return {
      'calendar': 'gregorian',
      'locale': locale,
      'numberingSystem': numberingSystemKey,
      'year': 'numeric',
      'month': 'numeric',
      'day': 'numeric',
      'patternFromOptions': patternFromOptions
    };
  };

  _availableTimeZonesImpl = function (localeElements) {

    function getLocalizedName(id, offset, metaZones, cities) {
      var parts = id.split('/');
      var region = parts[0];
      var city = parts[1];
      var locCity = "";
      var locZone = "";
      var nameObject = {};
      var metaRegion = cities[region];
      if (metaRegion !== undefined) {
        locCity = metaRegion[city];
        if (locCity !== undefined) {
          locCity = locCity['exemplarCity'];
          if (locCity !== undefined) {
            locCity = " " + locCity;
          }
        }
      }
      id = region + "/" + city;
      var metazones = localeElements['supplemental']['metazones'];
      var metaZone = _getMetazone(dParts, id, metazones);
      if(metaZones !== undefined)
        metaZone = metaZones[metaZone];
      if (metaZone !== undefined && metaZone !== null && metaZone['long'] !== undefined) {
        locZone = metaZone['long']['generic'];
        //some metazones do not have generic. Use standard 
        if (locZone === undefined) {
          locZone = metaZone['long']['standard'];
        }
        if (locZone !== undefined) {
          locZone = " - " + locZone;
        }
      }
      var locName = '(' + _UTC + ')';
      if (offset !== 0) {
        locName = OraI18nUtils.getTimeStringFromOffset(_UTC, offset, true, true);
        locName = "(" + locName + ")";
      }
      if (locCity === undefined || locZone === undefined) {
        return null;
      }
      nameObject['offsetLocName'] = locName + locCity + locZone;
      nameObject['locName'] = locCity + locZone;
      return nameObject;
    }

    function pushZoneNameObject(zones) {
      var i;
      var zone;
      var offset;
      for (i in zones) {
        zone = tz.getZone(i, localeElements);
        offset = _getStdOffset(zone, dParts);
        var localizedName = getLocalizedName(i, offset, metaZones, cities);
        if (localizedName === null) {
          continue;
        }
        sortedZones.push({
          'id': i,
          'displayName': localizedName
        });
        offsets[i] = offset;
      }
    }
    //return cahched array if available
    var locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    if (_timeZoneDataCache[locale] !== undefined) {
      var ret = _timeZoneDataCache[locale]['availableTimeZones'];
      if (ret !== undefined) {
        return ret;
      }
    }
    var tz = OraTimeZone.getInstance();
    var sortOptions = {sensitivity: 'variant'};
    var sortLocale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
    var mainNode = OraI18nUtils.getLocaleElementsMainNode(localeElements);
    var metaZones = mainNode['dates']['timeZoneNames']['metazone'];
    var cities = mainNode['dates']['timeZoneNames']['zone'];
    var sortedZones = [];
    var offsets = {};
    var d = new Date();
    var dParts = [d.getFullYear(), d.getMonth() + 1, d.getDate(),
      d.getHours(), d.getMinutes(), d.getSeconds()];
    var tzData = localeElements['supplemental']['timeZoneData'];

    pushZoneNameObject(tzData['zones']);
    //add the links
    pushZoneNameObject(tzData['links']);
    sortedZones.sort(function (a, b) {
      var res1 = (offsets[b['id']] - offsets[a['id']]);
      var res2 = a['displayName']['locName'].localeCompare(b['displayName']['locName'], sortLocale, sortOptions);
      return (res1 + res2);
    });
    var len = sortedZones.length;
    //return an array with "display name with offset" instead of the
    //object localizedName which was only used for sorting
    for (var j = 0; j < len; j++) {
      sortedZones[j]['displayName'] = sortedZones[j]['displayName']['offsetLocName'];
    }
    //cache the sorted zones
    if (_timeZoneDataCache[locale] === undefined) {
      _timeZoneDataCache[locale] = {};
      _timeZoneDataCache[locale]['availableTimeZones'] = sortedZones;
    }
    return sortedZones;
  };

  function _init() {
    return {
      /**
       * Format a date.
       * @memberOf OraDateTimeConverter
       * @param {string} value - an iso 8601 string to be formatted. It  may be in 
       * extended or non-extended form. http://en.wikipedia.org/wiki/ISO_8601
       * @param {Object} localeElements - the instance of LocaleElements bundle.
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millisecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.
       * If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs. 
       *  yet.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst.</b> is a Boolean value. Setting dst to true indicates the time is in DST. By default the
       * time is interpreted as standard time. The possible values of dst are: "true" or "false". Default is "false".<br>
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
       * (true) or 24-hour format (false) should be used. It is only relevant 
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
       * - <b>formatType.</b> a predefined formatting type. Allowed values: 
       * "date", "time", "datetime".<br>
       * - <b>dateFormat.</b> optional, specifies the date format field. 
       * Allowed values: "short", "medium", "long", "full". It is only 
       * considered when formatType is present. The default value 
       * is "short".<br>
       * - <b>timeFormat.</b> optional, specifies the time format field. 
       * Allowed values: "short", "medium", "long", "full". It is only 
       * considered when formatType is present. The default value 
       * is "short".<br><br>
       * The order of precedence is the following:<br>
       * 1. pattern.<br>
       * 2. ECMA options.<br>
       * 3. formatType.<br>
       * If options is ommitted, the default will be the following object:<br>
       * {<br>
       * year:"numeric",<br> 
       * month:"numeric",<br> 
       * day:"numeric"<br>
       * };
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode "nu" extension key. We currently support "arab", "latn" and "thai" 
       * numbering systems. EX: locale: 'en-US-u-nu-latn' 
       * @return {string|null} formatted date.
       * @throws {RangeError} If a propery value of the options parameter is 
       * out of range.
       * @throws {SyntaxError} If an Unexpected token is encountered in the 
       * pattern.
       * @throws {invalidISOString} if the ISO string is not valid.
       
       */
      format: function (value, localeElements, options, locale) {
        var val;
        var isoStrInfo;
        if (typeof value === "number") {
          val = OraI18nUtils.dateToLocalIso(new Date(value));
        }
        else if (typeof value === "string") {
          val = OraI18nUtils.trim(value);
          if (val === '')
            return null;
        }
        else {
          return null;
        }
        if (arguments.length <= 2 || options === undefined)
        {
          //default is yMd
          options = {
            'year': 'numeric',
            'month': 'numeric',
            'day': 'numeric'
          };
        }
        isoStrInfo = OraI18nUtils.getISOStrFormatInfo(val);
        var ret = _formatImpl(localeElements, options, isoStrInfo, locale);
        var numberingSystemKey = OraI18nUtils.getNumberingExtension(locale);
        if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
          numberingSystemKey = 'latn';
        if (numberingSystemKey !== 'latn') {
          var idx;
          var nativeRet = [];
          for (idx = 0; idx < ret.length; idx++)
          {
            if (ret[idx] >= '0' && ret[idx] <= '9')
              nativeRet.push(OraI18nUtils.numeringSystems[numberingSystemKey][ret[idx]]);
            else
              nativeRet.push(ret[idx]);

          }
          return nativeRet.join("");
        }
        return ret;
      },
      /**
       * Formats an ISO String as a relative date time. 
       * <p>
       * 
       * @param {string} value - iso 8601 string to be formatted. This value is compared with the current date 
       * on the client to arrive at the relative formatted value.
       *  @param {Object} localeElements - the instance of LocaleElements bundle.
       * @param {Object=} options - an Object literal containing the following properties. The 
       * default options are ignored during relative formatting <br> 
       * <b>formatUsing:</b> - Specifies the relative formatting convention. 
       * Allowed values are "displayName" and "calendar". Setting value to "displayName" uses the relative 
       * display name for the instance of the dateField, and one or two past and future instances. 
       * When omitted we use the implicit rules.<br>
       * <b>dateField:</b> - To be used in conjunction of 'displayName'  value 
       * of formatUsing attribute.  Allowed values are: "day", "week", "month", "year", "hour", "minute", "second".<br>
       * relativeTime:</b> - Allowed values are: "fromNow", "toNow". "fromNow" means the system's 
       * current date is the reference and "toNow" means the value attribute is the reference. Default "fromNow".<br>
       * <b>dateOnly:</b> - A boolean value that can be used in conjunction with 
       * calendar of formatUsing attribute.  When set to true date only format is used. Example: Sunday 
       * instead of Sunday at 2:30 PM. Default value is false.<br>
       * <b>timeZone:</b> - The timeZone attribute can be used to specify the 
       * time zone of the  value parameter.  The system's time zone is used for the current time. If timeZone 
       * attribute is not specified, we use the system's time zone  for both. The value parameter, which is an 
       * iso string, can be Z or contain and offset, in this case  the timeZone attribute is overwritten.
       *
       * @return {string} relative date.
       * 
       * @example <caption>Relative time in the future using implicit rules</caption>
       * var localeElements;
       * var dateInFuture = new Date();
       * dateInFuture.setMinutes(dateInFuture.getMinutes() + 41);
       * dateInFuture = OraI18nUtils.dateToLocalIso(dateInFuture);
       * var formatted = converter.formatRelative(dateInFuture, localeElements); -> in 41 minutes
       *
       * @example <caption>Relative time in the past using implicit rules</caption>
       * var localeElements;
       * var dateInPast = new Date();
       * dateInPast.setHours(dateInPast.getHours() - 20);
       * dateInPast = OraI18nUtils.dateToLocalIso(dateInPast);
       * var formatted = converter.formatRelative(dateInPast, localeElements); -> 20 hours ago
       *
       * @example <caption>Relative time using dateField. Assuming system's current date is 2016-07-28.</caption>
       * Format relative year:
       * var localeElements;
       * var options = {formatUsing: "displayName", dateField: "year"};
       * var formatted = converter.formatRelative("2015-06-01T00:00:00", localeElements, options); -> last year
       *
       * @example <caption>Relative time using relativeTime. Assuming system's current date is 2016-07-28.</caption>
       * var localeElements;
       * var options = {formatUsing: "displayName", dateField: "day", relativeTime: "fromNow"};
       * var formatted = converter.formatRelative("2016-07-28T00:00:00", localeElements, options); -> tomorrow
       * options = {formatUsing: "displayName", dateField: "day", relativeTime: "toNow"};
       * formatted = converter.formatRelative("2016-07-28T00:00:00", localeElements, options); -> yesterday
       *
       * @example <caption>Relative time using calendar. Assuming system's current date is 2016-07-28.</caption>
       * var localeElements;
       * var options = {formatUsing: "calendar"};
       * var formatted = converter.formatRelative("2016-07-28T14:15:00", localeElements, options); -> tomorrow at 2:30 PM
       *
       * 
       * @example <caption>Relative time using timeZone. Assuming that the system's time zone is America/Los_Angeles.</caption>
       * var localeElements;
       * var options = {timeZone:"America/New_York"};
       * var nyDateInFuture = new Date();
       * nyDateInFuture.setHours(nyDateInFuture.getHours() + 6);
       * nyDateInFuture = OraI18nUtils.dateToLocalIso(nyDateInFuture);
       * var formatted = converter.formatRelative(nyDateInFuture, localeElements, options); -> in 3 hours
       * 
       * @memberOf OraDateTimeConverter
       * @export
       */
      formatRelative: function (value, localeElements, options) {
        return _formatRelativeImpl(value, localeElements, options);
      },
      /**
       * Parse a date. It also support lenient parse when input does not match
       * the pattern.<br>
       * We first try to match month a pattern where we have month and weekday 
       * names Ex:  Monday Nov, 11 2013
       * weekday name and month name can be anywhere in the string.
       * if year > 2-digits it can be anywhere in the string. Otherwise we assume
       * its position based on pattern. Separators can be any non digit characters
       * <br>If month name is not present, we try lenient parse yMd and yMEd
       * pattern. Must have year, moth and date all numbers. Ex: 5/3/2013 weekday
       * is optional. If present it must match date. Ex:  Tuesday 11/19/2013
       * if year > 2-digits it can be anywhere in the string. Otherwise assume its
       * position based on pattern if date > 12 it can be anywhere in the string. 
       * Otherwise assume its position based on pattern separators can be any
       * non digit characters.<br><br>
       * @memberOf OraDateTimeConverter
       * @param {string} str - a String to be parsed. it can be an iso 8601 string
       * or a formatted string.
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millisecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.
       * If the users want to pass an offset, they can use one of the Etc/GMT timezone IDs. 
       *  yet.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst</b> is a Boolean value. Setting dst to true indicates the time is in DST. By default the
       * time is interpreted as standard time. The possible values of dst are: "true" or "false". Default is "false".<br>
       * -<b>isoStrFormat.</b>specifies in which format the ISO string is returned. 
       * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". The default format is auto.<br>
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
       * (true) or 24-hour format (false) should be used. It is only relevant 
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR.<br>
       * - <b>two-digit-year-start.</b> the 100-year period 2-digit year. 
       * During parsing, two digit years will be placed in the range 
       * two-digit-year-start to two-digit-year-start + 100 years. 
       * The default is 1950.<br>
       * - <b>formatType.</b> a predefined formatting type. Allowed values: 
       * "date", "time", "datetime".<br>
       * - <b>dateFormat.</b> optional, specifies the date format. Allowed 
       * values: "short", "medium", "long", "full". It is only considered when 
       * formatType is present. The default value is "short".<br>
       * - <b>timeFormat.</b> optional, specifies the time format. Allowed 
       * values: "short", "medium", "long", "full". It is only considered when 
       * formatType is present. The default value is "short".<br><br>
       * The order of precedence is the following:<br>
       * 1. pattern.<br>
       * 2. ECMA options.<br>
       * 3. formatType.<br>          
       * If options is ommitted, the default will be the following object:<br>
       * {<br>
       * year:"numeric",<br> 
       * month:"numeric",<br> 
       * day:"numeric"<br>
       * };
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode "nu" extension key. We currently support "arab", "latn" and "thai" 
       * numbering systems. EX: locale: 'en-US-u-nu-latn' 
       * @return {string} an iso 8601 extended String. http://en.wikipedia.org/wiki/ISO_8601.
       * If the patern is a date only, returns the date part of the iso string.
       * If the pattern is time only, returns the time part of the iso string. 
       * If the pattern is date-time, returns the date-time iso string.
       * <br>Example1:
       * <br> var pattern = 'MM/dd/yy hh:mm:ss a';
       * <br> cnv.parse('09/11/14 03:02:01 PM', localeElems, pattern);
       * <br> The return value is '2014-10-20T15:02:01'; 
       * <br>Example2:
       * <br> var pattern = 'MM/dd/yy';
       * <br> cnv.parse('09/11/14', localeElems, pattern);
       * <br> The return value is '2014-10-20'; 
       * <br>Example3:
       * <br> var pattern = 'hh:mm:ss a';
       * <br> cnv.parse('03:02:01 PM', localeElems, pattern);
       * <br> The return value is 'T15:02:01'; 
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {SyntaxError} If an Unexpected token is encountered in the 
       * pattern.
       * @throws {Error} If the <i>str</i> parameter does not match the format 
       * pattern.
       * @throws {RangeError} if one of the date fields is out of range.
       * @throws {invalidISOString} if the string to be parsed is an invalid ISO string.
       */
      parse: function (str, localeElements, options, locale) {
        return _parseImpl(str, localeElements, options, locale);
      },
      /**
       * Resolve options.
       * Returns a new object with properties reflecting the date and time 
       * formatting options computed based on the options parameter. 
       * If the options parameter is ommitted, the following object will be 
       * returned:<br>
       * {<br>
       * calendar: "gregorian"<br>
       * numberingSystem: "latn"<br>
       * locale: &lt;locale parameter&gt;,<br>
       * day: "numeric",<br>
       * month: "numeric",<br>
       * year: "numeric"<br>
       * };
       * @memberOf OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle                           
       * @param {Object=} options - Containing the following properties:<br>
       * - <b>calendar.</b> The calendar system.<br>
       * - <b>weekday.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>era.</b> Allowed values: "narrow", "short", "long".<br>
       * - <b>year.</b> Allowed values:"2-digit", "numeric".<br>
       * - <b>month.</b> Allowed values: "2-digit", "numeric", "narrow", 
       * "short", "long".<br>
       * - <b>day.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>hour.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>minute.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>second.</b> Allowed values: "2-digit", "numeric".<br>
       * - <b>millissecond.</b> Allowed values: "numeric".<br>
       * - <b>timeZone.</b> The possible values of the timeZone property are valid IANA timezone IDs.<br>
       * - <b>timeZoneName.</b> allowed values are "short", "long". </b> <br>
       * - <b>dst.</b> is a Boolean value. The possible values of dst are: "true" or "false". Default is "false".<br>
       * - <b>isoStrFormat.</b> specifies in which format the ISO string is returned. 
       * The possible values of isoStrFormat are: "offset", "zulu", "local", "auto". The default format is auto.<br> 
       * - <b>hour12.</b> is a Boolean value indicating whether 12-hour format 
       * (true) or 24-hour format (false) should be used. It is only relevant 
       * when hour is also present.<br>
       * - <b>pattern.</b> custom String pattern as defined by Unicode CLDR. 
       * Will override above options when present.<br>
       * - <b>two-digit-year-start.</b> the 100-year period 2-digit year. 
       * During parsing, two digit years will be placed in the range 
       * two-digit-year-start to two-digit-year-start + 100 years. 
       * The default is 1950.<br>
       * - <b>formatType.</b> predefined format type.  Allowed values: 
       * "datetime", "date", "time"<br>
       * - <b>dateFormat.</b> format of date field.  Allowed values: "short", 
       * "medium", "long", "full". It is only relevant when formatType is also 
       * present<br>
       * - <b>timeFormat.</b> format of time field.  Allowed values: "short", 
       * "medium", "long", "full". It is only relevant when formatType is also 
       * present<br>
       * @param {string=} locale - A BCP47 compliant language tag. it is only 
       * used to extract the unicode extension keys.
       * @return {Object} Resolved options object.
       * @throws {RangeError} If a property value of the options parameter is 
       * out of range.
       * @throws {Error} if weekday does not match the date.
       */

      resolvedOptions: function (localeElements, options, locale) {
        if (arguments.length < 3 || locale === undefined) {
          locale = OraI18nUtils.getLocaleElementsMainNodeKey(localeElements);
        }
        if (arguments.length < 2 || options === undefined)
        {
          //default is yMd
          options = {
            'year': 'numeric',
            'month': 'numeric',
            'day': 'numeric'
          };
        }
        var tz;
        var isoFormat;
        var dst;
        var getOption = OraI18nUtils.getGetOption(options, "OraDateTimeConverter.resolvedOptions");
        if (options !== undefined) {
          isoFormat = getOption('isoStrFormat', 'string',
              [_ZULU, _OFFSET, _INVARIANT, _LOCAL, _AUTO], _AUTO);
          dst = getOption('dst', 'boolean', [true, false], false);
          tz = options['timeZone'];
        }
        var numberingSystemKey = OraI18nUtils.getNumberingExtension(locale);
        if (OraI18nUtils.numeringSystems[numberingSystemKey] === undefined)
          numberingSystemKey = 'latn';
        if (options !== undefined && options['pattern'] !== undefined) {
          return _getPatternResolvedOptions(isoFormat, tz, dst, locale,
              numberingSystemKey, options);
        }
        if (options !== undefined) {
          return _getResolvedOptions(options, getOption, tz, dst, isoFormat,
              localeElements, numberingSystemKey, locale);
        }
        return _getResolvedDefaultOptions(localeElements, locale, numberingSystemKey);
      },
      /**
       * Returns the current week in the year when provided a date.
       * @memberOf OraDateTimeConverter
       * @param {string} date - iso 8601 string. It may be in extended or 
       * non-extended form. http://en.wikipedia.org/wiki/ISO_8601
       * @return {number}. The current week in the year when provided a date.
       */
      calculateWeek: function (date) {
        var d = OraI18nUtils.isoToLocalDate(date);
        var time;
        var checkDate = new Date(d.getTime());

        // Find Thursday of this week starting on Monday
        checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
        time = checkDate.getTime();
        checkDate.setMonth(0);// Compare with Jan 1
        checkDate.setDate(1);
        return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
      },
      /**
       * Returns the available timeZones.
       * @memberOf OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle
       * @return {Object}. An array of objects. Each object represents a timezone
       * and contains 2 attributes:<br>
       * 'id': IANA timezone ID<br>
       * 'displayName': It is the concatenation of 3 strings:<br>
       * 1- UTC timezone offset.<br>
       * 2- City name.<br>
       * 3- Generic time zone name
       * The displayName attribute is localized based on the current locale.
       * Example of an array entry in en-US locale:
       * {id: 'America/Edmonton',<br>
       *  displayName: '(UTC-07:00) Edmonton - Mountain Time'<br>
       * }<br>
       * The same array entry is the following in fr-FR locale:
       * {id: 'America/Edmonton',<br>
       *  displayName: '(UTC-07:00) Edmonton - heure des Rocheuses'<br>
       * }<br> 
       * The array is sorted by offsets in ascending order. Within the same offset,
       * the entries by displayName in ascending order.
       */
      getAvailableTimeZones: function (localeElements) {
        return _availableTimeZonesImpl(localeElements)
      },
      /**
       * Compares 2 ISO 8601 strings.
       * @memberOf OraDateTimeConverter
       * @param {string} isoStr1 isoString that may be date, time or date-time and possible timezone info
       * @param {string} isoStr2 isoString that may be date, time or date-time and with possible timezone info
       * @param {Object} localeElements - The instance of LocaleElements bundle                           
       * @returns {number} 0 if isoStr1 is equal to this isoStr2;
       *  a value less than 0 if isoStr1 is before isoStr2; and a value 
       *  greater than 0 if isoStr1 is after isoStr2.
       */
      compareISODates: function (isoStr1, isoStr2, localeElements) {
        var options = _getCompareISODatesOptions(isoStr1, isoStr2);
        var iso1 = _parseImpl(isoStr1, localeElements, options, "en-US");
        var iso2 = _parseImpl(isoStr2, localeElements, options, "en-US");
        var str1 = iso1['value'].replace("Z", "");
        var str2 = iso2['value'].replace("Z", "");
        var datetime1 = OraI18nUtils._IsoStrParts(str1);
        datetime1 = Date.UTC(datetime1[0], datetime1[1] - 1, datetime1[2], datetime1[3], datetime1[4], datetime1[5], datetime1[6]);
        var datetime2 = OraI18nUtils._IsoStrParts(str2);
        datetime2 = Date.UTC(datetime2[0], datetime2[1] - 1, datetime2[2], datetime2[3], datetime2[4], datetime2[5], datetime2[6]);
        return  (datetime1 - datetime2);
      },
      /**
       * returns if a locale is 12 or 24 hour format.
       * @memberOf OraDateTimeConverter
       * @param {Object} localeElements - The instance of LocaleElements bundle 
       * @returns {boolean} true if the locale's preferred hour format is 12, false for 24 hour format.
       * @since 2.2
       */
      isHour12: function (localeElements) {
        return _isHour12(localeElements);
      }
    };
  }

  return {
    /**
     * getInstance.
     * Returns the singleton instance of OraDateTimeConverter class.  
     * @memberOf OraDateTimeConverter
     * @return {Object} The singleton OraDateTimeConverter instance.
     */
    getInstance: function () {
      if (!instance) {
        instance = _init();
      }
      return instance;
    }
  };
}());

/**
 * Copyright (c) 2014, Oracle and/or its affiliates.
 * All rights reserved.
 */

/**
 * Constructs a LengthValidator that ensures the value entered is within a given length.
 * <p> 
 * By default this uses Javascript's String length property 
 * which counts a UTF-16 surrogate pair as length === 2. 
 * If you need to count surrogate pairs as length === 1, then set the 
 * <code class="prettyprint">countBy</code> option to <code class="prettyprint">"codePoint"</code>
 * or use
 * <code class="prettyprint">oj.LengthValidator.defaults.countBy = "codePoint";</code>
 * to set the page-wide default.
 * </p>
 * <p> 
 * You can customize the default messages of all validators including this one
 * using the messageDetail and messageSummary options.
 * <p>
 * @param {Object=} options an object literal used to provide:<p>
 * @param {string=} options.countBy - A string that specifies how to count the length. Valid values are
 * <code class="prettyprint">"codeUnit"</code> and <code class="prettyprint">"codePoint"</code>.
 * Defaults to <code class="prettyprint">oj.LengthValidator.defaults.countBy</code> which defaults
 * to <code class="prettyprint">"codeUnit"</code>.<br/>
 * <code class="prettyprint">"codeUnit"</code> uses javascript's length function which counts the 
 * number of UTF-16 code units. Here a Unicode surrogate pair has a length of two. <br/>
 * <code class="prettyprint">"codePoint"</code> 
 * counts the number of Unicode code points. 
 * Here a Unicode surrogate pair has a length of one.<br/>
 * @param {number=} options.min - a number 0 or greater that is the minimum length of the value.
 * @param {number=} options.max - a number 1 or greater that is the maximum length of the value.
 * @param {Object=} options.hint - an optional object literal of hints to be used. 
 * <p>The hint strings (e.g., hint.min) are  passed as the 'pattern' parameter to
 * [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.hint.max - a hint message to be used to indicate the allowed maximum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.max</code>.<p>
 * Tokens: <br/>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter {max} or fewer characters
 * @param {string=} options.hint.min - a hint message to be used to indicate the allowed minimum. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.min</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * Usage: <br/>
 * Enter {min} or more characters 
 * @param {string=} options.hint.inRange - a hint message to be used to indicate the allowed range. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.inRange</code>.<p>
 * Tokens: <br/>
 * {min} the minimum<p>
 * {max} - the maximum<p>
 * Usage: <br/>
 * Enter between {min} and {max} characters
 * @param {string=} options.hint.exact - a hint message to be used, to indicate the exact length. 
 * When not present, the default hint is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.hint.exact</code>.<p>
 * Tokens: <br/>
 * {length} the length<p>
 * Usage: <br/>
 * Enter {length} characters
 * @param {Object=} options.messageDetail - an optional object literal of custom error messages to 
 * be used.
 * <p>The messageDetail strings (e.g., messageDetail.tooLong) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageDetail.tooLong - the detail error message to be used as the error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooLong</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {max} - the maximum allowed value<p>
 * Usage: <br/>
 * The {value} has too many characters. Enter {max} or fewer characters, not more.
 * @param {string=} options.messageDetail.tooShort - the detail error message to be used as the error 
 * message, when the length of the input value is less the minimum value set. When not present, the 
 * default detail message is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageDetail.tooShort</code>.<p>
 * Tokens:<br/>
 * {value} - value entered by the user<br/>
 * {min} - the minimum allowed value<p>
 * Usage: <br/>
 * The {value} has too few characters. Enter {min} or more characters, not less.
 * @param {Object=} options.messageSummary - optional object literal of custom error summary message 
 * to be used. 
 * <p>The messageSummary strings (e.g., messageSummary.tooLong) are  passed as the 'pattern' 
 * parameter to [oj.Translations.html#applyParameters]{@link oj.Translations}. As stated in
 * that documentation, if you are using a reserved character, you need to escape it with 
 * a dollar character ('$').
 * </p> 
 * @param {string=} options.messageSummary.tooLong - the message to be used as the summary error 
 * message, when the length of the input value exceeds the maximum value set. When not present, the 
 * default message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooLong</code>.
 * @param {string=} options.messageSummary.tooShort - the message to be used as the summary error 
 * message, when input value is less than the set minimum value. When not present, the default 
 * message summary is the resource defined with the key 
 * <code class="prettyprint">oj-validator.length.messageSummary.tooShort</code>.
 * @export
 * @constructor
 * @since 0.7
 */
oj.LengthValidator = function (options)
{
  this.Init(options);
};

/**
 * The set of attribute/value pairs that serve as default values 
 * when new LengthValidator objects are created.
 * <p>
 * LengthValidator's <code class="prettyprint">countBy</code> option may be changed
 * for the entire application after the 'ojs/ojvalidation' module is loaded 
 * (each form control module includes the 'ojs/ojvalidation' module). If the 
 * <code class="prettyprint">options.countBy</code> is specifically set, 
 * it will take precedence over this default.
 * </p>
 * <p>For example:
 * <code class="prettyprint">
 * oj.LengthValidator.defaults.countBy = 'codePoint';
 * </code></p>
 * @property {string} countBy count the length by <code class="prettyprint">"codeUnit"</code> or 
 * <code class="prettyprint">"codePoint"</code>. 
 * Defaults to <code class="prettyprint">"codeUnit"</code>.
 * @export
 * @memberof oj.LengthValidator
 * @since 2.1.0
 */
oj.LengthValidator.defaults =
{
  'countBy': 'codeUnit'
};

// Subclass from oj.Object 
oj.Object.createSubclass(oj.LengthValidator, oj.Validator, "oj.LengthValidator");

/**
 * Initializes validator instance with the set options
 * @param {Object=} options
 * @export
 */
oj.LengthValidator.prototype.Init = function (options)
{
  var countByOptions = options["countBy"];

  oj.LengthValidator.superclass.Init.call(this);

  this._min = options["min"] !== undefined ? parseInt(options["min"], 10) : null;
  this._max = options["max"] !== undefined ? parseInt(options["max"], 10) : null;
  
  // check that the min/max make sense, otherwise throw an error
  if (isNaN(this._min))
    throw new Error("length validator's min option is not a number. min option is " + options["min"]);
  if (isNaN(this._max))
    throw new Error("length validator's max option is not a number. max option is " + options["min"]);
  if (this._min !== null && this._min < 0)
    throw new Error("length validator's min option cannot be less than 0. min option is " + 
      options["min"]);
  if (this._max !== null && this._max < 1)
    throw new Error("length validator's max option cannot be less than 1. max option is " + 
      options["max"]);
  
  this._countBy = (countByOptions === undefined) ?
  oj.LengthValidator.defaults['countBy'] : countByOptions;

  if (options)
  {
    this._hint = options['hint'] || {};
    this._customMessageSummary = options['messageSummary'] || {};
    this._customMessageDetail = options['messageDetail'] || {};

  }
};

oj.LengthValidator.prototype.getHint = function ()
{
  var hint = null;
  var hints = this._hint;
  var hintExact = hints["exact"];
  var hintInRange = hints["inRange"];
  var hintMaximum = hints["max"];
  var hintMinimum = hints["min"];

  var max = this._max;
  var min = this._min;
  var params;
  var translations = oj.Translations;

  if (min !== null && max !== null)
  {
    if (min !== max)
    {
      params = {"min": min, "max": max};
      hint = hintInRange ? translations.applyParameters(hintInRange, params) :
      translations.getTranslatedString('oj-validator.length.hint.inRange', params);
    }
    else
    {
      params = {'length': min};
      hint = hintExact ? translations.applyParameters(hintExact, params) :
      translations.getTranslatedString('oj-validator.length.hint.exact', params);
    }
  }
  else if (min !== null)
  {
    params = {"min": min};
    hint = hintMinimum ? translations.applyParameters(hintMinimum, params) :
    translations.getTranslatedString('oj-validator.length.hint.min', params);
  }
  else if (max !== null)
  {
    params = {"max": max};
    hint = hintMaximum ? translations.applyParameters(hintMaximum, params) :
    translations.getTranslatedString('oj-validator.length.hint.max', params);
  }

  return hint;
};

/**
 * Validates the length of value is greater than minimum and/or less than maximum.
 *
 * @param {string} value that is being validated
 * @returns {string} original if validation was successful
 *
 * @throws {Error} when the length is out of range.
 * @export
 */
oj.LengthValidator.prototype.validate = function (value)
{

  var customMessageDetail = this._customMessageDetail;
  var customMessageSummary = this._customMessageSummary;
  var detail = "";
  var length;
  var max = this._max;
  var messageSummaryTooLong = customMessageSummary["tooLong"];
  var messageSummaryTooShort = customMessageSummary["tooShort"];
  var messageTooLong = customMessageDetail["tooLong"];
  var messageTooShort = customMessageDetail["tooShort"];
  var min = this._min;
  var params;
  var string;
  var summary = "";
  var translations = oj.Translations;

  string = "" + value;
  length = this._getLength(string);

  // If only min is set and length is at least min, or 
  // if only max is set and length is at most max, or
  // if length is between min and max or
  // if neither min or max is set return with no error.
  if ((min === null || length >= this._min) &&
  ((max === null) || (length <= this._max)))
  {
    return string;
  }
  else
  {
    if (length < this._min) //too short
    {
      params = {"value": value, "min": min};
      summary = messageSummaryTooShort ? translations.applyParameters(messageSummaryTooShort, params) :
      translations.getTranslatedString('oj-validator.length.messageSummary.tooShort');
      detail = messageTooShort ? translations.applyParameters(messageTooShort, params) :
      translations.getTranslatedString('oj-validator.length.messageDetail.tooShort', params);
    }
    else // too long
    {
      params = {"value": value, "max": max};
      summary = messageSummaryTooLong ? translations.applyParameters(messageSummaryTooLong, params) :
      translations.getTranslatedString('oj-validator.length.messageSummary.tooLong');
      detail = messageTooLong ? translations.applyParameters(messageTooLong, params) :
      translations.getTranslatedString('oj-validator.length.messageDetail.tooLong', params);
    }

    throw new oj.ValidatorError(summary, detail);
  }
};

/**
 * @returns {number} the length of the text counted by UTF-16 codepoint
 *  or codeunit as specified in the countBy option.
 */
oj.LengthValidator.prototype._getLength = function (text)
{

  var countBy = this._countBy.toLowerCase();
  var codeUnitLength = text.length;
  var i;
  var length;
  var surrogateLength = 0;

  switch (countBy)
  {
    case "codepoint" :
      // if countBy is "codePoint", then count supplementary characters as length of one
      // For UTF-16, a "Unicode  surrogate pair" represents a single supplementary character. 
      // The first (high) surrogate is a 16-bit code value in the range U+D800 to U+DBFF. 
      // The second (low) surrogate is a 16-bit code value in the range U+DC00 to U+DFFF.
      // This code figures out if a charCode is a high or low surrogate and if so, 
      // increments surrogateLength
      for (i = 0; i < codeUnitLength; i++)
      {
        if ((text.charCodeAt(i) & 0xF800) === 0xD800)
        {
          surrogateLength++;
        }
      }
      // e.g., if the string is two supplementary characters, codeUnitLength is 4, and the 
      // surrogateLength is 4, so we will return two.
      oj.Assert.assert(surrogateLength%2 === 0, 
        "the number of surrogate chars must be an even number.");
      length = (codeUnitLength - surrogateLength / 2);
      break;
    case "codeunit" :
    default :
      // Javascript's length function counts # of code units. 
      // A supplementary character has a length of 2 code units.
      length = codeUnitLength;
  }
  return length;
};
});
